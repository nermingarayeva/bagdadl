const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", adminMiddleware, async (req, res) => {
  res.json([]);
});

module.exports = router;
