const express = require("express");
const router = express.Router();
const loginRoute = require("./loginRoute");
const registerRoute = require("./registerRoute");
const userDetails = require("./userDetails");

// Mount login and register routes
router.use("/login", loginRoute);
router.use("/register", registerRoute);
router.use("/user", userDetails);

module.exports = router;
