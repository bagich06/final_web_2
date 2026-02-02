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
