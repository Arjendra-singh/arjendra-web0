const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
  name: String,
  company: String,
  service: String,
  email: String,
  phone: String,
  message: String,
  consent: Boolean,
  source: String,
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', InquirySchema);