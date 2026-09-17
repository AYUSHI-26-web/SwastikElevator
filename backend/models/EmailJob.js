const mongoose = require('mongoose');

const emailJobSchema = new mongoose.Schema(
  {
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    sourceType: {
      type: String,
      enum: ['contact', 'service'],
      default: 'contact',
      required: true,
    },
    jobType: {
      type: String,
      enum: ['admin', 'welcome', 'review_request'],
      required: true,
      index: true,
    },
    to: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    html: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'sent', 'failed'],
      default: 'pending',
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 10,
    },
    nextAttemptAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    lastError: {
      type: String,
      default: '',
    },
    sentAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

emailJobSchema.index({ status: 1, nextAttemptAt: 1 });
emailJobSchema.index({ sourceId: 1, jobType: 1 }, { unique: true });

module.exports = mongoose.model('EmailJob', emailJobSchema);
