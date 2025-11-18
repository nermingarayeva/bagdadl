const jwt = require('jsonwebtoken');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Sepetə məhsul əlavə et
exports.addToCart = async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. You must be logged in to add items to the cart.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [{ productId, quantity }] });
      await cart.save();
      return res.status(201).json({ message: 'Product added to cart' });
    }

    // Məhsulu mövcud sepete əlavə et
    cart.products.push({ productId, quantity });
    await cart.save();
    res.status(200).json({ message: 'Product added to cart' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding product to cart', error: err });
  }
};
