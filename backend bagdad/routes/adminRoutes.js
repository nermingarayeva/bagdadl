const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../controllers/adminController"); // controller import
const verifyAdminToken = require("../middleware/adminMiddleware"); // ✅ Import əlavə et

// login route
router.post("/login", loginAdmin);

router.get("/verify", verifyAdminToken, (req, res) => {
    // Əgər middleware-dən keçibsə, token etibarlıdır
    res.json({ 
      valid: true, 
      admin: req.admin 
    });
  });
  
module.exports = router;
