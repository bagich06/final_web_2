const express = require("express");
const {
  getProfile,
  getOrderHistory,
  updateUserProfile,
  deleteOrder,
  updateOrder,
} = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateUserProfile);
router.get("/orders", auth, getOrderHistory);
router.delete("/orders/:id", auth, deleteOrder);
router.put("/orders/:id", auth, updateOrder);

module.exports = router;
