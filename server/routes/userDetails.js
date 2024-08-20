const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");


// Route to get user details
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Excluding password field from response

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Route to change username
router.post("/change-username", auth, async (req, res) => {
  const { name } = req.body;

  try {
    // Check if username is provided
    if (!name) {
      return res.status(400).json({ msg: "Please enter a new username." });
    }

    // Update the username in the database
    const user = await User.findById(req.user.id);
    user.name = name;
    await user.save();

    res.json({ msg: "Username updated successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Route to change password
router.post("/change-password", auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    // Check if all fields are provided
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ msg: "Please enter all fields." });
    }

    // Get the user from the database
    const user = await User.findById(req.user.id);

    // Check if the old password matches the one in the database
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect old password." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save the new password in the database
    await user.save();

    res.json({ msg: "Password updated successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

