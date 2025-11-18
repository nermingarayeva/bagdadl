const express = require("express");
const router = express.Router();
const News = require("../models/News");
const authMiddleware = require("../middleware/adminAuth"); // Token yoxlama

// ✅ GET - Bütün xəbərləri gətir (hamı görə bilər)
router.get("/", async (req, res) => {
  try {
    const news = await News.find({ isActive: true })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: news });
  } catch (error) {
    console.error("❌ Xəbərləri gətirərkən xəta:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server xətası" 
    });
  }
});

// ✅ POST - Yeni xəbər əlavə et (yalnız admin)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, category, author } = req.body;

    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        message: "Başlıq və məzmun mütləqdir" 
      });
    }

    const newNews = new News({
      title,
      content,
      category: category || "Faydalı",
      author: author || "Admin",
    });

    await newNews.save();
    res.status(201).json({ success: true, data: newNews });
  } catch (error) {
    console.error("❌ Xəbər əlavə edilərkən xəta:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server xətası" 
    });
  }
});

// ✅ PUT - Xəbəri yenilə (yalnız admin) ← BU LAZIMDIR!
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, content, category, author } = req.body;
    const { id } = req.params;

    console.log("🔄 Yeniləmə sorğusu:", { id, title, category });

    const updatedNews = await News.findByIdAndUpdate(
      id,
      { 
        title, 
        content, 
        category, 
        author 
      },
      { 
        new: true,           // Yeni versiyanı qaytarır
        runValidators: true  // Validation yoxlayır
      }
    );

    if (!updatedNews) {
      return res.status(404).json({ 
        success: false, 
        message: "Xəbər tapılmadı" 
      });
    }

    console.log("✅ Xəbər yeniləndi:", updatedNews);
    res.json({ success: true, data: updatedNews });
  } catch (error) {
    console.error("❌ Yeniləmə xətası:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server xətası" 
    });
  }
});

// ✅ DELETE - Xəbəri sil (yalnız admin)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNews = await News.findByIdAndDelete(id);

    if (!deletedNews) {
      return res.status(404).json({ 
        success: false, 
        message: "Xəbər tapılmadı" 
      });
    }

    res.json({ 
      success: true, 
      message: "Xəbər silindi",
      data: deletedNews 
    });
  } catch (error) {
    console.error("❌ Silinmə xətası:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server xətası" 
    });
  }
});

module.exports = router;