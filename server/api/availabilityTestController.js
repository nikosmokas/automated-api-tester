const express = require("express");
const axios = require("axios");
const TestResult = require("../models/AvailabilityTestResult");
const User = require("../models/User");
const TestRun = require("../models/AvailabilityTestRun");
const moment = require("moment");
const { runTest } = require("../tools/scripts/availabilityTestRun");
const schedule = require("node-schedule");
const { scheduledJobs } = require("../tools/schedulers/scheduler");

const performAvailabilityTest = async (req, res) => {
  const {
    userId,
    title,
    description,
    runChoice,
    runDateTime,
    recurringMinutes,
    urls,
  } = req.body;

  try {
    const user = await User.findByEmail(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for the number of scheduled and planned tests - Issue #1
    const scheduledTestsCount = await TestRun.countDocuments({ user: userId, status: { $in: ["Scheduled", "Recurring"] } });
    const plannedTestsCount = await TestRun.countDocuments({ user: userId, status: "Scheduled" });
    const oneHourAgo = moment().subtract(1, 'hour').toDate();
    const testsLastHour = await TestRun.countDocuments({ user: userId, createdAt: { $gte: oneHourAgo } });

    if (scheduledTestsCount >= 2) {
      return res.status(400).json({ message: "You can only have 2 scheduled tests at a time." });
    }

    if (plannedTestsCount >= 2) {
      return res.status(400).json({ message: "You can only have 2 planned tests at a time." });
    }

    if (testsLastHour >= 5) {
      return res.status(400).json({ message: "You can only run 5 tests per hour." });
    }


    let runNow = null;
    const utcDate = moment.utc().toDate();

    let date = null;
    let stat = "Scheduled";
    let interval = 0;
    let newRecurring = 0;

    if (runChoice === "Recurring") {
      if (!recurringMinutes) {
        newRecurring = 60;
        interval = newRecurring * 60 * 1000;
      } else {
        interval = recurringMinutes * 60 * 1000;
        newRecurring = recurringMinutes;
      }
      date = new Date(utcDate.getTime() + interval);
      stat = "Recurring";
      console.log("New Date in recurring:", date);
    } else if (runChoice === "Run Once") {
      if (runDateTime === null || runDateTime === "") {
        date = new Date(utcDate.getTime() + 60 * 1000);
      } else {
        date = new Date(runDateTime);
      }
    } else {
      runNow = new Date(utcDate.getTime());
      stat = "Running..";
    }

    // Create a new TestRun document
    const newTestRun = new TestRun({
      user: userId,
      title: title || "Untitled",
      description: description || "No description",
      status: stat,
      nextRun: date || null,
      lastRun: runNow || null,
      recurrency: newRecurring,
      urls,
    });
    let savedTestRun = await newTestRun.save();
    const testRunId = savedTestRun._id;

    console.log("Test after parsing:", savedTestRun);

    if (runChoice === "Run Once" && date) {
      // Schedule the test run
      console.log("Added run-once test in scheduler");
      const job = schedule.scheduleJob(date, async function () {
        await runTest(testRunId, scheduledJobs); // Pass scheduledJobs to runTest
        delete scheduledJobs[testRunId];
      });
      scheduledJobs[testRunId] = job;
      console.log("Scheduled jobs in runTest: ", scheduledJobs);
    }

    if (runChoice === "Recurring" && recurringMinutes) {
      console.log("Added recurring test in scheduler");
      const job = schedule.scheduleJob(
        { start: date, rule: `*/${recurringMinutes} * * * *` }, // Runs every recurringMinutes
        async function () {
          await runTest(testRunId, scheduledJobs); // Pass scheduledJobs to runTest
        }
      );
      scheduledJobs[testRunId] = job;
      console.log("Scheduled jobs in runTest: ", scheduledJobs);
    }

    console.log("Date and time now:", new Date());

    // If the test should run now
    if (runNow) {
      await runTest(testRunId, scheduledJobs); // Pass scheduledJobs to runTest
      savedTestRun = await TestRun.findByIdAndUpdate(testRunId, {
        status: "Completed",
      }); // Update status after test completion
    }

    res.status(200).json({
      message: "Test scheduled successfully",
      testRun: savedTestRun,
    });
  } catch (error) {
    console.error("Error performing availability test:", error);
    res.status(500).json({ message: "Failed to perform availability test" });
  }
};

// GET route to retrieve availability test results
const getAvailabilityTestResults = async (req, res) => {
  const { userId, testRunId } = req.query; // Assuming userId and testRunId are passed from frontend query params
  console.log("Date and time now:", new Date());
  try {
    // Find the test results based on userId and optionally testRunId
    let query = { user: userId };
    if (testRunId) {
      query.testRun = testRunId;
    }

    const results = await TestResult.find(query);
    res.status(200).json({ results });
  } catch (error) {
    console.error("Error fetching availability test results:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch availability test results" });
  }
};

// DELETE route to remove a test run
const deleteAvailabilityTest = async (req, res) => {
  const { id } = req.params;

  try {
    if (scheduledJobs && scheduledJobs[id]) {
      scheduledJobs[id].cancel();
      delete scheduledJobs[id];
      console.log(`Scheduled job for test ID ${id} canceled after deletion.`);
    }
    // Find and delete the test run
    await TestResult.deleteMany({ testRun: id });

    // Delete the test run
    const result = await TestRun.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "Test run deleted successfully" });
    } else {
      res.status(404).json({ message: "Test run not found" });
    }
  } catch (error) {
    console.error("Error deleting test run:", error);
    res.status(500).json({ message: "Failed to delete test run" });
  }
};

// GET route to retrieve availability test results
const getAvailabilityScheduledTest = async (req, res) => {
  const { userId, testRunId } = req.query; // Assuming userId and testRunId are passed from frontend query params
  console.log("Entered getAvailabilityScheduledTest");
  try {
    // Find the test results based on userId and optionally testRunId
    let query = { user: userId };
    if (testRunId) {
      query.testRun = testRunId;
    }

    const result = await TestRun.find(query);
    res.status(200).json({ result });
  } catch (error) {
    console.error("Error fetching availability test results:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch availability test results" });
  }
};

module.exports = {
  performAvailabilityTest,
  getAvailabilityTestResults,
  deleteAvailabilityTest,
  getAvailabilityScheduledTest,
};
