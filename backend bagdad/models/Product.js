const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String, 
    required: false, // ✅ false
    default: "" 
  },
  image: { 
    type: String, 
    required: false, // ✅ false
    default: null 
  },
  category: { 
    type: String, 
    required: false, // ✅ false
    default: "Ümumi" 
  },
  stock: { 
    type: Number, 
    required: false, // ✅ false
    default: 0 
  },
  benefits: { 
    type: [String], 
    required: false,
    default: [] 
  }
}, {
  timestamps: true // createdAt, updatedAt
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;