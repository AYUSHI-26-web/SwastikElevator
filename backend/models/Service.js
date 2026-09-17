const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  serviceType: { type: String, required: true },
  message: { type: String },
  status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
  reviewToken: { type: String, unique: true, sparse: true, index: true },
  reviewRequestedAt: { type: Date, default: null },
  reviewEmailStatus: {
    type: String,
    enum: ['not_sent', 'sent', 'queued', 'failed'],
    default: 'not_sent',
  },
  reviewEmailSentAt: { type: Date, default: null },
  reviewEmailLastError: { type: String, default: '' },
  reviewSubmittedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', ServiceSchema);
