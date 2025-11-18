const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Model-in yolu

// Bütün məhsulları gətir
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ TƏK MƏHSUL ÜÇÜN ROUTE (YENİ)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Məhsul tapılmadı" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;