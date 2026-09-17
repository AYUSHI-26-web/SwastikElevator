const mongoose = require('mongoose');

const reviewPhotoSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    type: { type: String, default: '' },
    size: { type: Number, default: 0 },
    dataUrl: { type: String, default: '' },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      default: '',
      trim: true,
    },
    companyBuilding: {
      type: String,
      default: '',
      trim: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    serviceUsed: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1200,
    },
    profileUrl: {
      type: String,
      default: '',
      trim: true,
    },
    photo: {
      type: reviewPhotoSchema,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ status: 1, approvedAt: -1, createdAt: -1 });
reviewSchema.index({ service: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Review', reviewSchema);
