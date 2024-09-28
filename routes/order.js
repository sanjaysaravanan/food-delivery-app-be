const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");

// Temporary in-memory cart (this can be replaced by a database model)
let cart = [];

router.get("/:phoneNumber", async (req, res) => {
  const { phoneNumber } = req.params;

  const orders = await Order.find({ phoneNumber });

  if (orders.length) {
    res.status(200).json(cart);
  } else {
    res.status(404).json({ message: "No Orders Found" });
  }
});

router.post("/place-order/:cartId", async (req, res) => {
  const { cartId } = req.params;
  const cart = (
    await Cart.findOne({ id: cartId }, { _id: 0, __v: 0 })
  ).toObject();

  if (cart) {
    const orderData = new Order({
      ...cart,
    });
    await orderData.save();
    // Clearing the Cart
    await Cart.deleteOne({ id: cartId });
    res.status(201).json({ message: "Order Created Successfully" });
  } else {
    res.status(404).json({ message: "No Cart Found" });
  }
});

module.exports = router;
