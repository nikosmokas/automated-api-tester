// availabilityTestRoute.js

const express = require("express");
const router = express.Router();
const AvailabilityTest = require("../controllers/availabilityTestController");
const TestRun = require("../models/AvailabilityTestRun");

router.post("/", AvailabilityTest.performAvailabilityTest);
router.get("/results", AvailabilityTest.getAvailabilityTestResults);

// GET /api/testruns - Fetch all test runs
router.get("/testhistory", async (req, res) => {
  try {
    const testRuns = await TestRun.find({ lastRun: { $ne: null } }).sort({
      createdAt: -1,
    });
    res.status(200).json(testRuns);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/scheduledtests", async (req, res) => {
  try {
    const scheduledTests = await TestRun.find({
      nextRun: { $gte: new Date() },
    }).sort({ nextRun: 1 });
    res.status(200).json(scheduledTests);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
