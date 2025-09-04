const mongoose = require('mongoose');

const analysisTechniqueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    enum: ['momentum', 'trend', 'volatility', 'volume', 'support_resistance', 'patterns'],
    default: 'trend'
  },
  periodicity: {
    type: String,
    required: true,
    enum: ['hourly', 'daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  timeframe: {
    type: String,
    enum: ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w', '1M'],
    default: '1d'
  },
  parameters: {
    period: {
      type: Number,
      min: 1,
      max: 200,
      default: 14
    },
    signal_threshold: {
      type: Number,
      min: 0,
      max: 100,
      default: 70
    },
    stop_loss: {
      type: Number,
      min: 0,
      max: 50,
      default: 2
    },
    take_profit: {
      type: Number,
      min: 0,
      max: 100,
      default: 5
    }
  },
  signal_conditions: {
    buy_condition: {
      type: String,
      maxlength: 500,
      default: 'Indicador acima do threshold de compra'
    },
    sell_condition: {
      type: String,
      maxlength: 500,
      default: 'Indicador abaixo do threshold de venda'
    },
    neutral_condition: {
      type: String,
      maxlength: 500,
      default: 'Indicador em zona neutra'
    }
  },
  risk_level: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  min_volume: {
    type: Number,
    min: 0,
    default: 1000000
  },
  market_cap_filter: {
    type: String,
    enum: ['small', 'medium', 'large', 'any'],
    default: 'any'
  },
  backtest_results: {
    win_rate: { type: Number, min: 0, max: 100 },
    profit_factor: { type: Number, min: 0 },
    max_drawdown: { type: Number, min: 0, max: 100 },
    sharpe_ratio: { type: Number },
    last_backtest: { type: Date }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

analysisTechniqueSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('AnalysisTechnique', analysisTechniqueSchema);