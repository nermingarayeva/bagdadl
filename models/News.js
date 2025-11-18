const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true,
      trim: true
    },
    content: { 
      type: String, 
      required: true 
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Faydalı",           // ✅ Frontend ilə eyni
        "Yeniliklər",
        "Reseptlər",
        "Sağlamlıq",
        "Məhsul Təqdimatı",
        "Kampaniyalar",
        "Digər"
      ],
      default: "Faydalı"
    },
    author: { 
      type: String, 
      default: "Admin",
      trim: true
    },
    summary: { 
      type: String,
      trim: true
    },
    source: { 
      type: String,
      trim: true
    },
    url: { 
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    deletedAt: {
      type: Date,
      default: null
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
  }
);

newsSchema.index({ isActive: 1, date: -1 });
newsSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model("News", newsSchema);