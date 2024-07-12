// availabilityTestRoute.js

const express = require("express");
const router = express.Router();
const AvailabilityTest = require("../controllers/availabilityTestController");

router.post("/", AvailabilityTest.performAvailabilityTest);
router.get("/results", AvailabilityTest.getAvailabilityTestResults);

module.exports = router;
