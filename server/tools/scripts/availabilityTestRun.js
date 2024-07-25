const TestResult = require("../../models/AvailabilityTestResult");
const TestRun = require("../../models/AvailabilityTestRun");
const performAvailabilityCheck = require("./availabilityCheck");
const moment = require("moment");
const schedule = require("node-schedule");

async function runTest(testId, scheduledJobs) {
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
  test.nextRun = null;
  await test.save();

  // Cancel the scheduled job if it exists
  if (scheduledJobs && scheduledJobs[testId]) {
    scheduledJobs[testId].cancel();
    delete scheduledJobs[testId];
    console.log(`Scheduled job for test ID ${testId} canceled.`);
  }

  // Create a new test run for the next interval
  if (test.recurrency > 0) {
    const utcDate = moment.utc().toDate();
    const newTestRun = new TestRun({
      user: test.user,
      title: test.title,
      description: test.description,
      status: "Recurring",
      lastRun: null,
      nextRun: new Date(utcDate.getTime() + test.recurrency * 60 * 1000),
      recurrency: test.recurrency,
      urls: test.urls,
    });
    await newTestRun.save();
    console.log(
      `New test created with ID: ${newTestRun._id} from test: ${testId}`
    );

    const rule = new schedule.RecurrenceRule();
    rule.minute = new Date(
      utcDate.getTime() + test.recurrency * 60 * 1000
    ).getUTCMinutes();
    const job = schedule.scheduleJob(rule, async function () {
      await runTest(newTestRun._id, scheduledJobs); // Pass scheduledJobs to runTest
    });
    if (scheduledJobs) {
      scheduledJobs[newTestRun._id] = job; // Store the new job
      console.log("Scheduled jobs in runTest: ", scheduledJobs);
    }
  }

  console.log(`Test ${testId} completed.`);
}

module.exports = {
  runTest,
};
