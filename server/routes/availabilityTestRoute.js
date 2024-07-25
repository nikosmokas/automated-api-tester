// availabilityTestRoute.js

const express = require("express");
const router = express.Router();
const AvailabilityTest = require("../api/availabilityTestController");
const TestRun = require("../models/AvailabilityTestRun");

router.post("/", AvailabilityTest.performAvailabilityTest);
router.get("/results", AvailabilityTest.getAvailabilityTestResults);
router.delete("/testhistory/:id", AvailabilityTest.deleteAvailabilityTest);
router.delete("/scheduledtests/:id", AvailabilityTest.deleteAvailabilityTest);
router.get("/scheduledTestCard", AvailabilityTest.getAvailabilityScheduledTest);

// GET /api/testruns - Fetch all test runs
router.get("/testhistory", async (req, res) => {
  try {
    const currentDate = new Date();
    const testRuns = await TestRun.find({ lastRun: { $lt: currentDate } }).sort(
      {
        updatedAt: -1,
      }
    );
    res.status(200).json(testRuns);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/scheduledtests", async (req, res) => {
  try {
    const currentDateTime = new Date(); // Get the current date and time
    const scheduledTests = await TestRun.find({
      nextRun: { $gte: currentDateTime }, // Ensure nextRun is in the future
    }).sort({ nextRun: 1 });
    res.status(200).json(scheduledTests);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
