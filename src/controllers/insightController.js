const Insight = require('../models/Insight');
const analysisService = require('../services/analysisService');
const logger = require('../config/logger');
const Joi = require('joi');

class InsightController {
  async getAll(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        asset, 
        technique, 
        recommendation, 
        isHidden = false,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;
      
      const query = { isHidden: isHidden === 'true' };
      
      if (asset) query.asset = asset;
      if (technique) query.technique = technique;
      if (recommendation) query.recommendation = recommendation;

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const insights = await Insight.find(query)
        .populate('asset', 'symbol name type market')
        .populate('technique', 'title description')
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Insight.countDocuments(query);

      res.json({
        success: true,
        data: insights,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      });
    } catch (error) {
      logger.error('Error fetching insights:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getById(req, res) {
    try {
      const insight = await Insight.findById(req.params.id)
        .populate('asset', 'symbol name type market')
        .populate('technique', 'title description');
      
      if (!insight) {
        return res.status(404).json({
          success: false,
          message: 'Insight not found'
        });
      }

      res.json({
        success: true,
        data: insight
      });
    } catch (error) {
      logger.error('Error fetching insight:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async hideInsight(req, res) {
    try {
      const insight = await Insight.findByIdAndUpdate(
        req.params.id,
        { isHidden: true },
        { new: true }
      ).populate('asset', 'symbol name')
       .populate('technique', 'title');

      if (!insight) {
        return res.status(404).json({
          success: false,
          message: 'Insight not found'
        });
      }

      logger.info(`Insight hidden: ${insight.asset.symbol} - ${insight.technique.title}`);
      res.json({
        success: true,
        data: insight
      });
    } catch (error) {
      logger.error('Error hiding insight:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async showInsight(req, res) {
    try {
      const insight = await Insight.findByIdAndUpdate(
        req.params.id,
        { isHidden: false },
        { new: true }
      ).populate('asset', 'symbol name')
       .populate('technique', 'title');

      if (!insight) {
        return res.status(404).json({
          success: false,
          message: 'Insight not found'
        });
      }

      logger.info(`Insight shown: ${insight.asset.symbol} - ${insight.technique.title}`);
      res.json({
        success: true,
        data: insight
      });
    } catch (error) {
      logger.error('Error showing insight:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getPositionSuggestions(req, res) {
    try {
      const { 
        recommendation = 'buy,sell', 
        minConfidence = 50,
        limit = 20 
      } = req.query;

      const recommendationArray = recommendation.split(',');
      
      const insights = await Insight.find({
        recommendation: { $in: recommendationArray },
        confidence: { $gte: minConfidence },
        isHidden: false
      })
      .populate('asset', 'symbol name type market')
      .populate('technique', 'title description')
      .sort({ confidence: -1, createdAt: -1 })
      .limit(limit * 1);

      const suggestions = insights.map(insight => ({
        id: insight._id,
        asset: insight.asset,
        technique: insight.technique,
        recommendation: insight.recommendation,
        confidence: insight.confidence,
        analysis: insight.analysis,
        currentPrice: insight.price,
        targetPrice: insight.targetPrice,
        stopLoss: insight.stopLoss,
        executedAt: insight.executedAt,
        createdAt: insight.createdAt
      }));

      res.json({
        success: true,
        data: suggestions,
        total: suggestions.length
      });
    } catch (error) {
      logger.error('Error fetching position suggestions:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getInsightsByAsset(req, res) {
    try {
      const { assetId } = req.params;
      const { 
        limit = 10, 
        isHidden = false,
        recommendation 
      } = req.query;
      
      const query = { 
        asset: assetId,
        isHidden: isHidden === 'true'
      };
      
      if (recommendation) query.recommendation = recommendation;

      const insights = await Insight.find(query)
        .populate('technique', 'title description')
        .sort({ createdAt: -1 })
        .limit(limit * 1);

      res.json({
        success: true,
        data: insights
      });
    } catch (error) {
      logger.error('Error fetching insights by asset:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getDashboardStats(req, res) {
    try {
      const [
        totalInsights,
        buyRecommendations,
        sellRecommendations,
        holdRecommendations,
        hiddenInsights,
        recentInsights
      ] = await Promise.all([
        Insight.countDocuments({ isHidden: false }),
        Insight.countDocuments({ recommendation: 'buy', isHidden: false }),
        Insight.countDocuments({ recommendation: 'sell', isHidden: false }),
        Insight.countDocuments({ recommendation: 'hold', isHidden: false }),
        Insight.countDocuments({ isHidden: true }),
        Insight.find({ isHidden: false })
          .populate('asset', 'symbol name')
          .populate('technique', 'title')
          .sort({ createdAt: -1 })
          .limit(5)
      ]);

      const avgConfidence = await Insight.aggregate([
        { $match: { isHidden: false } },
        { $group: { _id: null, avgConfidence: { $avg: '$confidence' } } }
      ]);

      res.json({
        success: true,
        data: {
          totals: {
            insights: totalInsights,
            buy: buyRecommendations,
            sell: sellRecommendations,
            hold: holdRecommendations,
            hidden: hiddenInsights
          },
          avgConfidence: avgConfidence[0]?.avgConfidence || 0,
          recentInsights
        }
      });
    } catch (error) {
      logger.error('Error fetching dashboard stats:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new InsightController();