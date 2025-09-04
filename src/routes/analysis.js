const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');

router.post('/manual', analysisController.runManualAnalysis);
router.post('/run/:periodicity', analysisController.runPeriodicityAnalysis);
router.get('/jobs/status', analysisController.getJobStatus);
router.post('/jobs/start', analysisController.startJobs);
router.post('/jobs/stop', analysisController.stopJobs);

module.exports = router;