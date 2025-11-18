const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Şəkil yükləmə
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./uploads/campaigns";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `campaign-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Yalnız şəkil faylları yükləyə bilərsiniz"));
    }
  },
});

// GET - Bütün kampaniyalar
router.get("/", async (req, res) => {
  try {
    console.log("✅ GET /api/campaigns - Kampaniyalar sorğusu alındı");
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json({ success: true, data: campaigns });
  } catch (error) {
    console.error("❌ Kampaniyaları gətirərkən xəta:", error);
    res.status(500).json({ success: false, message: "Server xətası" });
  }
});
// GET - Tək məhsul
router.get("/:id", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      
      if (!product) {
        return res.status(404).json({ message: "Məhsul tapılmadı" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("❌ Məhsul gətirərkən xəta:", error);
      res.status(500).json({ message: "Server xətası" });
    }
  });
// POST - Yeni kampaniya
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("✅ POST /api/campaigns - Yeni kampaniya əlavə edilir");
    console.log("📥 Body:", req.body);
    console.log("📥 File:", req.file);

    const {
      title,
      description,
      discount,
      originalPrice,
      discountedPrice,
      startDate,
      endDate,
      code,
      category,
      isActive,
    } = req.body;

    if (!title || !description || !discount || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Bütün mütləq sahələri doldurun",
      });
    }

    const newCampaign = new Campaign({
      title,
      description,
      discount,
      originalPrice,
      discountedPrice,
      startDate,
      endDate,
      code,
      category,
      isActive: isActive !== undefined ? isActive : true,
      image: req.file ? `/uploads/campaigns/${req.file.filename}` : null,
    });

    await newCampaign.save();
    console.log("✅ Kampaniya əlavə edildi:", newCampaign);
    res.status(201).json({ success: true, data: newCampaign });
  } catch (error) {
    console.error("❌ Kampaniya əlavə edilərkən xəta:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Kampaniyanı yenilə
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    console.log("✅ PUT /api/campaigns/:id - Kampaniya yenilənir");
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = `/uploads/campaigns/${req.file.filename}`;
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCampaign) {
      return res.status(404).json({ success: false, message: "Kampaniya tapılmadı" });
    }

    res.json({ success: true, data: updatedCampaign });
  } catch (error) {
    console.error("❌ Yeniləmə xətası:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE - Kampaniyanı sil
router.delete("/:id", async (req, res) => {
  try {
    console.log("✅ DELETE /api/campaigns/:id - Kampaniya silinir");
    const { id } = req.params;

    const deletedCampaign = await Campaign.findByIdAndDelete(id);

    if (!deletedCampaign) {
      return res.status(404).json({ success: false, message: "Kampaniya tapılmadı" });
    }

    res.json({ success: true, message: "Kampaniya silindi" });
  } catch (error) {
    console.error("❌ Silinmə xətası:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;