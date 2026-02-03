exports.updateOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { products } = req.body;
    const order = await Order.findOne({ _id: id, user: userId });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "pending") {
      return res.status(400).json({ message: "Можно изменить только заказ в статусе pending" });
    }
    if (products && Array.isArray(products)) {
      order.products = products;
    }
    order.updatedAt = new Date();
    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
};
exports.deleteOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const order = await Order.findOne({ _id: id, user: userId });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "pending") {
      return res.status(400).json({ message: "Можно удалить только заказ в статусе pending" });
    }
    await order.deleteOne();
    res.json({ message: "Order deleted" });
  } catch (err) {
    next(err);
  }
};
const User = require("../models/User");
const Order = require("../models/Order");

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const bcrypt = require("bcryptjs");

exports.updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { username, email, password } = req.body;
    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (password) {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true, context: "query" },
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.getOrderHistory = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "products.product",
    );
    res.json(orders);
  } catch (err) {
    next(err);
  }
};
