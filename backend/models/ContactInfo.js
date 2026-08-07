const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: true,
    enum: ['Phone', 'Mail', 'MapPin', 'Clock', 'MessageSquare']
  },
  title: {
    type: String,
    required: true
  },
  details: {
    type: [String],
    required: true
  },
  action: {
    type: String,
    required: true
  },
  actionText: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ContactInfo', contactInfoSchema);
