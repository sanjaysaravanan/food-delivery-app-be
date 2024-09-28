const mongoose = require("mongoose");

const CartItem = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: false },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  restrauntId: { type: String, required: true },
});

const cartSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  items: [CartItem],
});

const Cart = mongoose.model("Cart", cartSchema, "cart");

module.exports = Cart;
