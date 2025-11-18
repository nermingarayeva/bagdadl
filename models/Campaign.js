const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    discountedPrice: {
      type: Number,
      min: 0,
    },
    image: {
      type: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    code: {
      type: String,
      uppercase: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Məhsul", "Çatdırılma", "Ümumi", "Sezon"],
      default: "Ümumi",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Campaign", campaignSchema);