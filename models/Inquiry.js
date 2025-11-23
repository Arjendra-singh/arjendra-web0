const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  company: { type: String, default: '', trim: true },
  service: { type: String, enum: ['Software Dev','GeM Consultancy','General'], required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  message: { type: String, required: true, maxlength: 2000 },
  consent: { type: Boolean, default: false },
  source: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', InquirySchema);
