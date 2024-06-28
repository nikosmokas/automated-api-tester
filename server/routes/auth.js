const express = require("express");
const router = express.Router();
const loginRoute = require("./loginRoute");
const registerRoute = require("./registerRoute");

// Mount login and register routes
router.use("/login", loginRoute);
router.use("/register", registerRoute);

module.exports = router;
