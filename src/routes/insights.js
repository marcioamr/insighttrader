const express = require('express');
const router = express.Router();
const insightController = require('../controllers/insightController');

router.get('/', insightController.getAll);
router.get('/suggestions', insightController.getPositionSuggestions);
router.get('/dashboard', insightController.getDashboardStats);
router.get('/:id', insightController.getById);
router.patch('/:id/hide', insightController.hideInsight);
router.patch('/:id/show', insightController.showInsight);
router.get('/asset/:assetId', insightController.getInsightsByAsset);

module.exports = router;