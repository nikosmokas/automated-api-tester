// scheduler.js
const schedule = require("node-schedule");
const TestRun = require("../../models/AvailabilityTestRun"); // Adjust the path as necessary
const TestResult = require("../../models/AvailabilityTestResult");
const performAvailabilityCheck = require("../scripts/availabilityCheck");

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

async function scheduleRecurringTests() {
  const tests = await TestRun.find({ status: "Recurring" });

  tests.forEach((test) => {
    const rule = new schedule.RecurrenceRule();
    rule.hour = test.nextRun.getUTCHours();
    rule.minute = test.nextRun.getUTCMinutes();
    rule.second = test.nextRun.getUTCSeconds();
    rule.tz = "UTC"; // Ensure the time zone is UTC

    // Schedule the job
    schedule.scheduleJob(rule, async function () {
      await runTest(test._id);
      // Update next run time for the recurring job
      test.nextRun = new Date(
        test.nextRun.getTime() + test.recurrency * 24 * 60 * 60 * 1000
      );
      await test.save();
    });
  });
}

async function runTest(testId) {
  const test = await TestRun.findById(testId);
  if (!test) {
    console.error(`Test with ID ${testId} not found.`);
    return;
  }
  console.log("Fetched test:", test);

  // Check if `urls` is defined and is an array
  if (!Array.isArray(test.urls)) {
    console.error(`Test ${testId} does not have a valid 'urls' field.`);
    return;
  }

  // Perform availability test on each URL
  const testResults = [];
  for (const url of test.urls) {
    const availability = await performAvailabilityCheck(url);

    let result;
    if (availability === "available") {
      result = "Success";
    } else if (availability === "not available") {
      result = "Failed";
    } else {
      result = availability;
    }

    const newTestResult = new TestResult({
      user: test.user,
      testRun: testId,
      url,
      result,
    });
    const savedResult = await newTestResult.save();
    testResults.push(savedResult);
  }

  // Update the status of the TestRun to "Completed"
  test.status = "Completed";
  test.lastRun = new Date();

  if (test.recurrency == 0) {
    test.nextRun = null;
  }
  await test.save();

  console.log(`Test ${testId} completed.`);
}

module.exports = {
  scheduleRunOnceTests,
  scheduleRecurringTests,
  runTest,
};
