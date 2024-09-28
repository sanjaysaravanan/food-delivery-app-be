// routes/cart.js
const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const { v4 } = require("uuid");

// Temporary in-memory cart (this can be replaced by a database model)
let cart = [];

// @route   GET /cart
// @desc    Get all cart items
router.get("/:phoneNumber", async (req, res) => {
  const { phoneNumber } = req.params;

  const cart = await Cart.findOne({ phoneNumber });

  if (cart) {
    res.status(200).json(cart);
  } else {
    res.status(404).json({ message: "No Products in Cart" });
  }
});

// @route   POST /add-to-cart
// @desc    Add item to cart
router.post("/add-to-cart/:phoneNumber", async (req, res) => {
  const { phoneNumber } = req.params;
  const { price, qty, image, restrauntId, name } = req.body;

  // Validate fields
  if (!price || !qty || !image || !restrauntId || !name) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Add new dish to the cart
  const newDish = {
    price,
    qty,
    image,
    restrauntId,
    name,
  };

  console.log(newDish);

  const cart = await Cart.findOne({ phoneNumber }, { _id: 0, __v: 0 });

  if (cart) {
    const existingCart = {
      ...cart.toObject(),
    };

    existingCart.total += price * qty;
    existingCart.items.push(newDish);

    await Cart.replaceOne({ phoneNumber }, existingCart);
    res.json({ message: "Item Added Successfully" });
  } else {
    const newCart = new Cart({
      id: v4(),
      phoneNumber,
      total: price * qty,
      items: [newDish],
    });

    await newCart.save();
    res.json({ message: "Item Added Successfully" });
  }
});

module.exports = router;
