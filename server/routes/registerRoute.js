const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Adjust the path as per your project structure
const auth = require("../middleware/auth");

const router = express.Router();

// Register a new user
router.post("/", async (req, res) => {
  let { email, name, password } = req.body;

  try {
    // Check if the email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Set default value for name if it is empty or undefined
    if (!name || name.trim().length === 0) {
      name = "Mysterious Guy";
    }

    // Create a new user
    user = new User({
      email,
      name,
      password,
    });

    // Encrypt the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    res.json({ msg: "User registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
