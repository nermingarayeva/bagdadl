// models/Testimonial.js
const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  email: { type: String, required: true },
  message: { type: String, required: true },
  approved: { type: Boolean, default: false }, // YENİ: default false
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);