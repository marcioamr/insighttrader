const AssetTechnique = require('../models/AssetTechnique');
const Asset = require('../models/Asset');
const AnalysisTechnique = require('../models/AnalysisTechnique');
const logger = require('../config/logger');
const Joi = require('joi');

const assetTechniqueSchema = Joi.object({
  asset: Joi.string().required(),
  technique: Joi.string().required(),
  isActive: Joi.boolean().default(true)
});

class AssetTechniqueController {
  async create(req, res) {
    try {
      const { error, value } = assetTechniqueSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      const asset = await Asset.findById(value.asset);
      const technique = await AnalysisTechnique.findById(value.technique);

      if (!asset) {
        return res.status(404).json({
          success: false,
          message: 'Asset not found'
        });
      }

      if (!technique) {
        return res.status(404).json({
          success: false,
          message: 'Analysis technique not found'
        });
      }

      const assetTechnique = new AssetTechnique(value);
      await assetTechnique.save();

      await assetTechnique.populate(['asset', 'technique']);

      logger.info(`Asset-technique association created: ${asset.symbol} - ${technique.title}`);
      res.status(201).json({
        success: true,
        data: assetTechnique
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'This asset-technique association already exists'
        });
      }
      
      logger.error('Error creating asset-technique association:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, asset, technique, isActive } = req.query;
      const query = {};
      
      if (asset) query.asset = asset;
      if (technique) query.technique = technique;
      if (isActive !== undefined) query.isActive = isActive === 'true';

      const associations = await AssetTechnique.find(query)
        .populate('asset', 'symbol name type market')
        .populate('technique', 'title description periodicity')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await AssetTechnique.countDocuments(query);

      res.json({
        success: true,
        data: associations,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      });
    } catch (error) {
      logger.error('Error fetching asset-technique associations:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getById(req, res) {
    try {
      const association = await AssetTechnique.findById(req.params.id)
        .populate('asset', 'symbol name type market')
        .populate('technique', 'title description periodicity');
      
      if (!association) {
        return res.status(404).json({
          success: false,
          message: 'Asset-technique association not found'
        });
      }

      res.json({
        success: true,
        data: association
      });
    } catch (error) {
      logger.error('Error fetching asset-technique association:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async update(req, res) {
    try {
      const updateSchema = Joi.object({
        isActive: Joi.boolean().required()
      });

      const { error, value } = updateSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      const association = await AssetTechnique.findByIdAndUpdate(
        req.params.id,
        value,
        { new: true, runValidators: true }
      ).populate('asset', 'symbol name type market')
       .populate('technique', 'title description periodicity');

      if (!association) {
        return res.status(404).json({
          success: false,
          message: 'Asset-technique association not found'
        });
      }

      logger.info(`Asset-technique association updated: ${association.asset.symbol} - ${association.technique.title}`);
      res.json({
        success: true,
        data: association
      });
    } catch (error) {
      logger.error('Error updating asset-technique association:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async delete(req, res) {
    try {
      const association = await AssetTechnique.findByIdAndDelete(req.params.id)
        .populate('asset', 'symbol name')
        .populate('technique', 'title');
      
      if (!association) {
        return res.status(404).json({
          success: false,
          message: 'Asset-technique association not found'
        });
      }

      logger.info(`Asset-technique association deleted: ${association.asset.symbol} - ${association.technique.title}`);
      res.json({
        success: true,
        message: 'Asset-technique association deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting asset-technique association:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getByAsset(req, res) {
    try {
      const assetId = req.params.assetId;
      const { isActive } = req.query;
      
      const query = { asset: assetId };
      if (isActive !== undefined) query.isActive = isActive === 'true';

      const associations = await AssetTechnique.find(query)
        .populate('technique', 'title description periodicity isActive')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: associations
      });
    } catch (error) {
      logger.error('Error fetching techniques for asset:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getByTechnique(req, res) {
    try {
      const techniqueId = req.params.techniqueId;
      const { isActive } = req.query;
      
      const query = { technique: techniqueId };
      if (isActive !== undefined) query.isActive = isActive === 'true';

      const associations = await AssetTechnique.find(query)
        .populate('asset', 'symbol name type market isActive')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: associations
      });
    } catch (error) {
      logger.error('Error fetching assets for technique:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new AssetTechniqueController();