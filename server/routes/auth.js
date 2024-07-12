const express = require("express");
const router = express.Router();
const loginRoute = require("./loginRoute");
const registerRoute = require("./registerRoute");
const userDetails = require("./userDetails");
const availabilityTestRoute = require("./availabilityTestRoute");

// Mount login and register routes
router.use("/login", loginRoute);
router.use("/register", registerRoute);
router.use("/user", userDetails);
router.use("/tests/availabilityTest", availabilityTestRoute)


module.exports = router;
