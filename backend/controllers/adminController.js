const Order = require("../models/Order");
const User = require("../models/User");

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate("user", "username email")
      .populate("products.product");
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
};
