const mongoose = require('mongoose');

const mediaAssetSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      default: 'upload',
      trim: true,
    },
    contentType: {
      type: String,
      required: true,
      enum: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/x-icon', 'image/vnd.microsoft.icon'],
    },
    size: {
      type: Number,
      required: true,
    },
    data: {
      type: Buffer,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
  },
  { timestamps: true }
);

mediaAssetSchema.index({ createdAt: -1 });

module.exports = mongoose.model('MediaAsset', mediaAssetSchema);
