const Product = require('../models/Product');

// Məhsul əlavə etmə
exports.addProduct = async (req, res) => {
  const { name, price, description, image, category, stock, benefits } = req.body;

  try {
    const newProduct = new Product({
      name,
      price,
      description,
      image,
      category,
      stock,
      benefits  // Faydalı məlumatları əlavə edirik
    });
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (err) {
    res.status(500).json({ message: 'Error adding product', error: err });
  }
};

// Məhsul redaktə etmə
exports.updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, price, description, image, category, stock, benefits } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(productId, {
      name,
      price,
      description,
      image,
      category,
      stock,
      benefits  // Faydalı məlumatları da yeniləyirik
    }, { new: true });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product', error: err });
  }
};
