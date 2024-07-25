// scheduler.js
const schedule = require("node-schedule");
const TestRun = require("../../models/AvailabilityTestRun"); // Adjust the path as necessary
const { runTest } = require("../scripts/availabilityTestRun");

async function scheduleRunOnceTests() {
  // Fetch all tests that are scheduled to run once in the future
  const tests = await TestRun.find({
    nextRun: { $ne: null },
    status: "Run Once",
  });

  tests.forEach((test) => {
    const runTime = new Date(test.nextRun);

    // Schedule the job
    schedule.scheduleJob(runTime, async function () {
      await runTest(test._id);
      console.log("Running scheduled test with id: ", test);
    });
  });
}

module.exports = scheduleRunOnceTests;
