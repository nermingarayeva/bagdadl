const express = require("express");
const router = express.Router();
const { getOrders } = require("../controllers/orderController");
const adminMiddleware = require("../middleware/adminMiddleware");

// Orders – protected route
router.get("/", adminMiddleware, getOrders);

module.exports = router;
