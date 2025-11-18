const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');  // doğru metodları idxal edirik

// Admin  qeydiyyatı
router.post('/register', register);

// Login funksiyası
router.post('/login', login);

module.exports = router;
