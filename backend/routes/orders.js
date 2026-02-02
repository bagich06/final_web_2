const express = require("express");
const {
  createOrder,
  getMyOrders,
  getOrderById,
} = require("../controllers/orderController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, createOrder);
router.get("/", auth, getMyOrders);
router.get("/:id", auth, getOrderById);

module.exports = router;
