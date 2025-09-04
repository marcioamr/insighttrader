const AnalysisTechnique = require('../models/AnalysisTechnique');
const logger = require('../config/logger');
const Joi = require('joi');

const techniqueSchema = Joi.object({
  title: Joi.string().required().max(200).trim(),
  description: Joi.string().required().max(1000).trim(),
  category: Joi.string().valid('momentum', 'trend', 'volatility', 'volume', 'support_resistance', 'patterns').default('trend'),
  periodicity: Joi.string().valid('hourly', 'daily', 'weekly', 'monthly').default('daily'),
  timeframe: Joi.string().valid('1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w', '1M').default('1d'),
  parameters: Joi.object({
    period: Joi.number().min(1).max(200).default(14),
    signal_threshold: Joi.number().min(0).max(100).default(70),
    stop_loss: Joi.number().min(0).max(50).default(2),
    take_profit: Joi.number().min(0).max(100).default(5)
  }).default({}),
  signal_conditions: Joi.object({
    buy_condition: Joi.string().max(500).default('Indicador acima do threshold de compra'),
    sell_condition: Joi.string().max(500).default('Indicador abaixo do threshold de venda'),
    neutral_condition: Joi.string().max(500).default('Indicador em zona neutra')
  }).default({}),
  risk_level: Joi.string().valid('low', 'medium', 'high').default('medium'),
  min_volume: Joi.number().min(0).default(1000000),
  market_cap_filter: Joi.string().valid('small', 'medium', 'large', 'any').default('any'),
  backtest_results: Joi.object({
    win_rate: Joi.number().min(0).max(100),
    profit_factor: Joi.number().min(0),
    max_drawdown: Joi.number().min(0).max(100),
    sharpe_ratio: Joi.number(),
    last_backtest: Joi.date()
  }).default({}),
  isActive: Joi.boolean().default(true)
});

class AnalysisTechniqueController {
  async create(req, res) {
    try {
      const { error, value } = techniqueSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      const technique = new AnalysisTechnique(value);
      await technique.save();

      logger.info(`Analysis technique created: ${technique.title}`);
      res.status(201).json({
        success: true,
        data: technique
      });
    } catch (error) {
      logger.error('Error creating analysis technique:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, isActive } = req.query;
      const query = {};
      
      if (isActive !== undefined) {
        query.isActive = isActive === 'true';
      }

      const techniques = await AnalysisTechnique.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await AnalysisTechnique.countDocuments(query);

      res.json({
        success: true,
        data: techniques,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      });
    } catch (error) {
      logger.error('Error fetching analysis techniques:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getById(req, res) {
    try {
      const technique = await AnalysisTechnique.findById(req.params.id);
      
      if (!technique) {
        return res.status(404).json({
          success: false,
          message: 'Analysis technique not found'
        });
      }

      res.json({
        success: true,
        data: technique
      });
    } catch (error) {
      logger.error('Error fetching analysis technique:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async update(req, res) {
    try {
      const { error, value } = techniqueSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      const technique = await AnalysisTechnique.findByIdAndUpdate(
        req.params.id,
        value,
        { new: true, runValidators: true }
      );

      if (!technique) {
        return res.status(404).json({
          success: false,
          message: 'Analysis technique not found'
        });
      }

      logger.info(`Analysis technique updated: ${technique.title}`);
      res.json({
        success: true,
        data: technique
      });
    } catch (error) {
      logger.error('Error updating analysis technique:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async delete(req, res) {
    try {
      const technique = await AnalysisTechnique.findByIdAndDelete(req.params.id);
      
      if (!technique) {
        return res.status(404).json({
          success: false,
          message: 'Analysis technique not found'
        });
      }

      logger.info(`Analysis technique deleted: ${technique.title}`);
      res.json({
        success: true,
        message: 'Analysis technique deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting analysis technique:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async activate(req, res) {
    try {
      const technique = await AnalysisTechnique.findByIdAndUpdate(
        req.params.id,
        { isActive: true },
        { new: true }
      );

      if (!technique) {
        return res.status(404).json({
          success: false,
          message: 'Analysis technique not found'
        });
      }

      logger.info(`Analysis technique activated: ${technique.title}`);
      res.json({
        success: true,
        data: technique
      });
    } catch (error) {
      logger.error('Error activating analysis technique:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async deactivate(req, res) {
    try {
      const technique = await AnalysisTechnique.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );

      if (!technique) {
        return res.status(404).json({
          success: false,
          message: 'Analysis technique not found'
        });
      }

      logger.info(`Analysis technique deactivated: ${technique.title}`);
      res.json({
        success: true,
        data: technique
      });
    } catch (error) {
      logger.error('Error deactivating analysis technique:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new AnalysisTechniqueController();