const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: 10
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  type: {
    type: String,
    required: true,
    enum: ['stock', 'currency', 'commodity', 'index'],
    default: 'stock'
  },
  market: {
    type: String,
    required: true,
    enum: ['B3', 'USD', 'CRYPTO'],
    default: 'B3'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  logoPath: {
    type: String,
    trim: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
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

assetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Asset', assetSchema);