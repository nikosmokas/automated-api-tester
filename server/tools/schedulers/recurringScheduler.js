const schedule = require("node-schedule");
const TestRun = require("../../models/AvailabilityTestRun"); // Adjust the path as necessary

const scheduledJobs = {};

async function scheduleRecurringTests(runTest) {
  try {
    const tests = await TestRun.find({ status: "Recurring" });

    tests.forEach((test) => {
      const rule = new schedule.RecurrenceRule();
      rule.hour = test.nextRun.getUTCHours();
      rule.minute = test.nextRun.getUTCMinutes();
      rule.second = test.nextRun.getUTCSeconds();
      rule.tz = "UTC";

      schedule.scheduleJob(rule, async function () {
        console.log("Running recuring test with id: ", test);
        try {
          await runTest(test._id);
          test.nextRun = new Date(
            test.nextRun.getTime() + test.recurrency * 60 * 1000
          );
          await test.save();
        } catch (err) {
          console.error(`Error running test with ID: ${test._id}`, err);
        }
      });

      scheduledJobs[test._id] = job;
      console.log("Scheduled jobs in scheduler: ", scheduledJobs);
    });
  } catch (err) {
    console.error("Error fetching recurring tests from the database", err);
  }
}

module.exports = { scheduleRecurringTests, scheduledJobs };
