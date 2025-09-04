const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('./config/database');
const logger = require('./config/logger');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const cronService = require('./services/cronService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

app.use('/', routes);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    logger.info('Database connected successfully');

    await cronService.initialize();
    logger.info('Cron service initialized');

    if (process.env.NODE_ENV === 'production') {
      cronService.startJobs();
      logger.info('Cron jobs started in production mode');
    }

    app.listen(PORT, () => {
      logger.info(`InsightTrader server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Error starting server:', error.message);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err.message);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  console.error('Full error:', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  cronService.stopJobs();
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  cronService.stopJobs();
  process.exit(0);
});

if (require.main === module) {
  startServer();
}

module.exports = app;