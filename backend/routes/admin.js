const express = require("express");
const {
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/adminController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/orders", auth, admin, getAllOrders);
router.patch("/orders/:id/status", auth, admin, updateOrderStatus);

module.exports = router;
