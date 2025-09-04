const cron = require('node-cron');
const AssetTechnique = require('../models/AssetTechnique');
const analysisService = require('./analysisService');
const logger = require('../config/logger');

class CronService {
  constructor() {
    this.jobs = new Map();
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) {
      logger.warn('CronService already initialized');
      return;
    }

    try {
      await this.setupPeriodicJobs();
      this.isInitialized = true;
      logger.info('CronService initialized successfully');
    } catch (error) {
      logger.error('Error initializing CronService:', error.message);
      throw error;
    }
  }

  async setupPeriodicJobs() {
    const hourlyJob = cron.schedule('0 * * * *', async () => {
      logger.info('Running hourly analysis job');
      await this.runAnalysisForPeriodicity('hourly');
    }, {
      scheduled: false,
      timezone: 'America/Sao_Paulo'
    });

    const dailyJob = cron.schedule('0 9 * * 1-5', async () => {
      logger.info('Running daily analysis job');
      await this.runAnalysisForPeriodicity('daily');
    }, {
      scheduled: false,
      timezone: 'America/Sao_Paulo'
    });

    const weeklyJob = cron.schedule('0 9 * * 1', async () => {
      logger.info('Running weekly analysis job');
      await this.runAnalysisForPeriodicity('weekly');
    }, {
      scheduled: false,
      timezone: 'America/Sao_Paulo'
    });

    const monthlyJob = cron.schedule('0 9 1 * *', async () => {
      logger.info('Running monthly analysis job');
      await this.runAnalysisForPeriodicity('monthly');
    }, {
      scheduled: false,
      timezone: 'America/Sao_Paulo'
    });

    this.jobs.set('hourly', hourlyJob);
    this.jobs.set('daily', dailyJob);
    this.jobs.set('weekly', weeklyJob);
    this.jobs.set('monthly', monthlyJob);

    logger.info('Periodic analysis jobs configured');
  }

  async runAnalysisForPeriodicity(periodicity) {
    try {
      const associations = await AssetTechnique.find({
        isActive: true
      })
      .populate({
        path: 'asset',
        match: { isActive: true }
      })
      .populate({
        path: 'technique',
        match: { 
          isActive: true,
          periodicity: periodicity
        }
      });

      const validAssociations = associations.filter(
        assoc => assoc.asset && assoc.technique
      );

      logger.info(`Found ${validAssociations.length} active associations for ${periodicity} analysis`);

      const results = await Promise.allSettled(
        validAssociations.map(async (association) => {
          try {
            return await analysisService.performAnalysis(
              association.asset,
              association.technique
            );
          } catch (error) {
            logger.error(`Analysis failed for ${association.asset.symbol} - ${association.technique.title}:`, error.message);
            throw error;
          }
        })
      );

      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;

      logger.info(`${periodicity} analysis completed: ${successful} successful, ${failed} failed`);

      return {
        total: validAssociations.length,
        successful,
        failed,
        results: results.map(result => ({
          status: result.status,
          value: result.status === 'fulfilled' ? result.value : null,
          reason: result.status === 'rejected' ? result.reason.message : null
        }))
      };
    } catch (error) {
      logger.error(`Error running ${periodicity} analysis:`, error.message);
      throw error;
    }
  }

  startJobs() {
    if (!this.isInitialized) {
      throw new Error('CronService not initialized. Call initialize() first.');
    }

    this.jobs.forEach((job, name) => {
      job.start();
      logger.info(`Started ${name} cron job`);
    });

    logger.info('All cron jobs started');
  }

  stopJobs() {
    this.jobs.forEach((job, name) => {
      job.stop();
      logger.info(`Stopped ${name} cron job`);
    });

    logger.info('All cron jobs stopped');
  }

  async runManualAnalysis(assetId, techniqueId) {
    try {
      const association = await AssetTechnique.findOne({
        asset: assetId,
        technique: techniqueId,
        isActive: true
      })
      .populate('asset')
      .populate('technique');

      if (!association) {
        throw new Error('Asset-technique association not found or inactive');
      }

      if (!association.asset.isActive) {
        throw new Error('Asset is inactive');
      }

      if (!association.technique.isActive) {
        throw new Error('Analysis technique is inactive');
      }

      const result = await analysisService.performAnalysis(
        association.asset,
        association.technique
      );

      logger.info(`Manual analysis completed for ${association.asset.symbol} - ${association.technique.title}`);
      return result;
    } catch (error) {
      logger.error('Error running manual analysis:', error.message);
      throw error;
    }
  }

  getJobStatus() {
    const status = {};
    this.jobs.forEach((job, name) => {
      status[name] = {
        running: job.running || false,
        scheduled: job.scheduled || false
      };
    });
    return status;
  }

  async getNextExecutionTimes() {
    const times = {};
    this.jobs.forEach((job, name) => {
      if (job.nextDate) {
        times[name] = job.nextDate();
      }
    });
    return times;
  }
}

module.exports = new CronService();