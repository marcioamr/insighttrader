const mongoose = require('mongoose');

const assetTechniqueSchema = new mongoose.Schema({
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

assetTechniqueSchema.index({ asset: 1, technique: 1 }, { unique: true });

assetTechniqueSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('AssetTechnique', assetTechniqueSchema);