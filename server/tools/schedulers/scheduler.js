const schedule = require("node-schedule");
const TestRun = require("../../models/AvailabilityTestRun");
const { runTest } = require("../scripts/availabilityTestRun");

const scheduledJobs = {}; // Object to track scheduled jobs

async function scheduleRunOnceTests() {
  try {
    // Fetch all tests that are scheduled to run once in the future
    const tests = await TestRun.find({
      nextRun: { $ne: null },
      status: "Run Once",
    });

    tests.forEach((test) => {
      const runTime = new Date(test.nextRun);

      // Schedule the job
      const job = schedule.scheduleJob(runTime, async function () {
        await runTest(test._id, scheduledJobs);
        console.log("Running scheduled one-time test with ID:", test._id);
      });

      // Track the job
      scheduledJobs[test._id] = job;
    });
  } catch (error) {
    console.error("Error scheduling run-once tests:", error);
  }
}

async function scheduleRecurringTests() {
  try {
    const tests = await TestRun.find({ status: "Recurring" });

    tests.forEach((test) => {
      const rule = new schedule.RecurrenceRule();
      rule.hour = test.nextRun.getUTCHours();
      rule.minute = test.nextRun.getUTCMinutes();
      rule.second = test.nextRun.getUTCSeconds();
      rule.tz = "UTC";

      const job = schedule.scheduleJob(rule, async function () {
        await runTest(test._id, scheduledJobs);
        console.log("Running recurring test with ID:", test._id);
      });

      // Track the job
      scheduledJobs[test._id] = job;
    });
  } catch (error) {
    console.error("Error scheduling recurring tests:", error);
  }
}

// Expose functions and the scheduledJobs object
module.exports = {
  scheduleRunOnceTests,
  scheduleRecurringTests,
  scheduledJobs,
};
