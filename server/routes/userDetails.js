// Import necessary modules
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Assuming User model exists
const auth = require("../middleware/auth"); // Assuming auth middleware is defined

// Route to get user details
router.get("/user", auth, async (req, res) => {
  try {
    // Fetch user details from database based on authenticated user ID
    const user = await User.findById(req.user.id).select("-password"); // Excluding password field from response

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Return user details (e.g., name, email)
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
