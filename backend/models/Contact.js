const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  salutation: { type: String, required: true },
  name: { type: String, required: true },
  company: { type: String, default: '' },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  number: { type: String, required: true },
  buildingName: { type: String, default: '' },
  city: { type: String, required: true },
  state: { type: String, required: true },
  subject: { type: String, default: '' },
  message: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
