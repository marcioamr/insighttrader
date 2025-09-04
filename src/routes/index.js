const express = require('express');
const router = express.Router();

const analysisTechniquesRoutes = require('./analysisTechniques');
const assetsRoutes = require('./assets');
const assetTechniquesRoutes = require('./assetTechniques');
const insightsRoutes = require('./insights');
const analysisRoutes = require('./analysis');
const assetSyncRoutes = require('./assetSync');
const imagesRoutes = require('./images');

router.use('/api/analysis-techniques', analysisTechniquesRoutes);
router.use('/api/assets', assetsRoutes);
router.use('/api/asset-techniques', assetTechniquesRoutes);
router.use('/api/insights', insightsRoutes);
router.use('/api/analysis', analysisRoutes);
router.use('/api/asset-sync', assetSyncRoutes);
router.use('/images', imagesRoutes);

router.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'InsightTrader API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;