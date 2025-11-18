const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number,
    },
  ],
  totalPrice: Number,
  status: { type: String, default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
