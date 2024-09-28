const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth.js");
const restrauntRoutes = require("./routes/restraunts.js");
const cartRoutes = require("./routes/cart.js");
const orderRoutes = require("./routes/order.js");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware for parsing JSON
app.use(bodyParser.json());
app.use(cors());

const logger = (req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
};

app.use(logger);

// authorization middleware
const verifyAuthorization = (req, res, next) => {
  // Expect a valid JWT Token from the Front-End or Client instance
  // Veriify the JWT using the jwt.verify

  const token = req.headers["auth-token"];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        console.log(err);
        res.status(403).json({ msg: "Unauthorized or Invalid Token" });
      } else {
        next();
      }
    });
  } else {
    res.status(403).json({ msg: "Unauthorized" });
  }
};

// Use the auth routes
// Below auth APIs does not require authorization
app.use("/auth", authRoutes);

// Below APIs requires authorization
app.use("/restraunts", verifyAuthorization, restrauntRoutes);
app.use("/cart", verifyAuthorization, cartRoutes);
app.use("/order", verifyAuthorization, orderRoutes);

// Start the server
const PORT = process.env.PORT || 3000;

const url = process.env.DB_URL;

// MongoDB connection
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
