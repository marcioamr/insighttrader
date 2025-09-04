const cronService = require('../services/cronService');
const logger = require('../config/logger');

class AnalysisController {
  async runManualAnalysis(req, res) {
    try {
      const { assetId, techniqueId } = req.body;

      if (!assetId || !techniqueId) {
        return res.status(400).json({
          success: false,
          message: 'Asset ID and Technique ID are required'
        });
      }

      const result = await cronService.runManualAnalysis(assetId, techniqueId);

      res.json({
        success: true,
        message: 'Manual analysis completed successfully',
        data: result
      });
    } catch (error) {
      logger.error('Error in manual analysis:', error.message);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async runPeriodicityAnalysis(req, res) {
    try {
      const { periodicity } = req.params;

      if (!['hourly', 'daily', 'weekly', 'monthly'].includes(periodicity)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid periodicity. Must be: hourly, daily, weekly, or monthly'
        });
      }

      const result = await cronService.runAnalysisForPeriodicity(periodicity);

      res.json({
        success: true,
        message: `${periodicity} analysis completed`,
        data: result
      });
    } catch (error) {
      logger.error(`Error in ${req.params.periodicity} analysis:`, error.message);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getJobStatus(req, res) {
    try {
      const status = cronService.getJobStatus();
      const nextExecutions = await cronService.getNextExecutionTimes();

      res.json({
        success: true,
        data: {
          jobs: status,
          nextExecutions
        }
      });
    } catch (error) {
      logger.error('Error getting job status:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async startJobs(req, res) {
    try {
      cronService.startJobs();
      res.json({
        success: true,
        message: 'All cron jobs started successfully'
      });
    } catch (error) {
      logger.error('Error starting jobs:', error.message);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async stopJobs(req, res) {
    try {
      cronService.stopJobs();
      res.json({
        success: true,
        message: 'All cron jobs stopped successfully'
      });
    } catch (error) {
      logger.error('Error stopping jobs:', error.message);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new AnalysisController();