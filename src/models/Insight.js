const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: true
  },
  technique: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnalysisTechnique',
    required: true
  },
  analysis: {
    type: String,
    required: true,
    trim: true
  },
  recommendation: {
    type: String,
    required: true,
    enum: ['buy', 'sell', 'hold'],
    lowercase: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  targetPrice: {
    type: Number,
    min: 0
  },
  stopLoss: {
    type: Number,
    min: 0
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  executedAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

insightSchema.index({ asset: 1, createdAt: -1 });
insightSchema.index({ recommendation: 1, isHidden: 1 });

module.exports = mongoose.model('Insight', insightSchema);