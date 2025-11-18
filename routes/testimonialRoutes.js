// routes/testimonials.js (və ya server.js içində)

const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const authMiddleware = require('../middleware/adminMiddleware'); // admin üçün

// 1. İSTİFADƏÇİ rəy yazar (TOKEN TƏLƏB ETMİR)
router.post('/api/testimonials', async (req, res) => {
  try {
    const { email, message } = req.body;
    
    const newTestimonial = new Testimonial({ 
      email, 
      message,
      approved: false // Başlanğıcda təsdiqlənməyib
    });
    
    await newTestimonial.save();
    res.json({ message: 'Rəyiniz göndərildi, yoxlanılır...' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. HOMEPAGE üçün - YALNIZ TƏSDİQLƏNMİŞ rəylər
router.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ approved: true })
      .sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. ADMIN PANEL - BÜTÜN rəylər (təsdiqlənmiş + gözləyən)
router.get('/api/testimonials/all', authMiddleware, async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. ADMIN - Rəyi təsdiqlə
router.put('/api/testimonials/:id/approve', authMiddleware, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    res.json(testimonial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. ADMIN - Rəyi sil
router.delete('/api/testimonials/:id', authMiddleware, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rəy silindi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;