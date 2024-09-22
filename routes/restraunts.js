const express = require("express");
const { v4 } = require("uuid");
const router = express.Router();
const Restaurant = require("../models/Restraunt");

// POST /restaurants - Create a new restaurant
router.post("/", async (req, res) => {
  const { name, image, email, phone, address, area } = req.body;
  try {
    const newRestaurant = new Restaurant({
      name,
      image,
      email,
      phone,
      address,
      area,
      id: v4(),
    });
    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating restaurant" });
  }
});

// PUT /restaurants/:id - Update an existing restaurant
router.put("/:id", async (req, res) => {
  const { name, image, email, phone, address, area } = req.body;
  const { id } = req.params;
  try {
    const updatedRestaurant = await Restaurant.updateOne(
      { id },
      { name, image, email, phone, address, area },
      { new: true }
    );
    if (!updatedRestaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.status(200).json(updatedRestaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating restaurant" });
  }
});

// GET /restaurants - Get all restaurants
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching restaurants" });
  }
});

// GET /restaurants/:id - Get a restaurant by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await Restaurant.findOne({ id });
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching restaurant" });
  }
});

// DELETE /restaurants/:id - Delete a restaurant by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRestaurant = await Restaurant.deleteOne({ id });
    if (!deletedRestaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting restaurant" });
  }
});

module.exports = router;
