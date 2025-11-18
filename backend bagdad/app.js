require('dotenv').config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const adminRoutes = require("./routes/adminRoutes");
const newsRoutes = require("./routes/newsRoutes");
const adminMiddleware = require("./middleware/adminMiddleware");
const campaignRoutes = require("./routes/campaigns");
const orderRoutes = require("./routes/orderRoutes")
require("dotenv").config();


const app = express();
connectDB();
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173", // React portu
    credentials: true,
  })
);
const testimonialRoutes = require('./routes/testimonialRoutes');
const commentRoutes = require("./routes/commentRoutes");
const Testimonial = require('./models/Testimonial');


app.use(express.json());
app.use("/api/products", productRoutes); // products API
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/news", newsRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/uploads", express.static("uploads"));
// app.use("/api/admin/login", adminRoutes); // login üçün middleware yoxdur
app.use("/api/admin/auth", adminRoutes); 
app.use('/api/orders', orderRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminMiddleware, adminRoutes);

// 1. İSTİFADƏÇİ rəy yazar (TOKEN TƏLƏB ETMİR)
app.post('/api/testimonials', async (req, res) => {
  try {
    const { email, message } = req.body;
    const newTestimonial = new Testimonial({ email, message, approved: false });
    await newTestimonial.save();
    res.json({ message: 'Rəyiniz göndərildi!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. HOMEPAGE - YALNIZ TƏSDİQLƏNMİŞ rəylər
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ approved: true }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. ADMIN - BÜTÜN rəylər
app.get('/api/testimonials/all',  adminMiddleware, async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. ADMIN - Rəyi təsdiqlə
app.put('/api/testimonials/:id/approve',  adminMiddleware, async (req, res) => {
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
app.delete('/api/testimonials/:id', adminMiddleware, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rəy silindi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Admin route-ları (admin middleware ilə qorunan)
app.use("/api/admin", adminMiddleware, adminRoutes);
app.get('/api/docs', (req, res) => {
    res.json({
      success: true,
      message: 'Bagdad  API Documentation',
      version: '1.0.0',
      endpoints: {
        news: {
          get: 'GET /api/news',
          create: 'POST /api/news',
          update: 'PUT /api/news/:id',
          delete: 'DELETE /api/news/:id'
        },
      }
    });
  });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
