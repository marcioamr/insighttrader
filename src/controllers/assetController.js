const Asset = require('../models/Asset');
const logger = require('../config/logger');
const Joi = require('joi');

const assetSchema = Joi.object({
  symbol: Joi.string().required().max(10).uppercase().trim(),
  name: Joi.string().required().max(200).trim(),
  type: Joi.string().valid('stock', 'currency', 'commodity', 'index').default('stock'),
  market: Joi.string().valid('B3', 'USD', 'CRYPTO').default('B3'),
  isActive: Joi.boolean().default(true)
});

class AssetController {
  async create(req, res) {
    try {
      const { error, value } = assetSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      const asset = new Asset(value);
      await asset.save();

      logger.info(`Asset created: ${asset.symbol}`);
      res.status(201).json({
        success: true,
        data: asset
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Asset symbol already exists'
        });
      }
      
      logger.error('Error creating asset:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, type, market, isActive } = req.query;
      const query = {};
      
      if (type) query.type = type;
      if (market) query.market = market;
      if (isActive !== undefined) query.isActive = isActive === 'true';

      const assets = await Asset.find(query)
        .sort({ symbol: 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Asset.countDocuments(query);

      res.json({
        success: true,
        data: assets,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      });
    } catch (error) {
      logger.error('Error fetching assets:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getById(req, res) {
    try {
      const asset = await Asset.findById(req.params.id);
      
      if (!asset) {
        return res.status(404).json({
          success: false,
          message: 'Asset not found'
        });
      }

      res.json({
        success: true,
        data: asset
      });
    } catch (error) {
      logger.error('Error fetching asset:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async update(req, res) {
    try {
      const { error, value } = assetSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      const asset = await Asset.findByIdAndUpdate(
        req.params.id,
        value,
        { new: true, runValidators: true }
      );

      if (!asset) {
        return res.status(404).json({
          success: false,
          message: 'Asset not found'
        });
      }

      logger.info(`Asset updated: ${asset.symbol}`);
      res.json({
        success: true,
        data: asset
      });
    } catch (error) {
      logger.error('Error updating asset:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async delete(req, res) {
    try {
      const asset = await Asset.findByIdAndDelete(req.params.id);
      
      if (!asset) {
        return res.status(404).json({
          success: false,
          message: 'Asset not found'
        });
      }

      logger.info(`Asset deleted: ${asset.symbol}`);
      res.json({
        success: true,
        message: 'Asset deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting asset:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new AssetController();