const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  pincode: { type: String, required: true },
  addressLine1: { type: String, required: true },
  area: { type: String, required: true },
  addressType: {
    type: String,
    required: true,
    enum: ["Home", "Work", "Other"],
  },
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
