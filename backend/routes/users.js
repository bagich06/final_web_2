const express = require("express");
const {
  getProfile,
  getOrderHistory,
} = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", auth, getProfile);
router.get("/orders", auth, getOrderHistory);

module.exports = router;
