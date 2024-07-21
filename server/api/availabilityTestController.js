const express = require("express");
const axios = require("axios");
const TestResult = require("../models/AvailabilityTestResult");
const User = require("../models/User");
const TestRun = require("../models/AvailabilityTestRun");
const moment = require("moment");
const { runTest } = require("../tools/schedulers/scheduler");
const schedule = require("node-schedule");

const performAvailabilityTest = async (req, res) => {
  const {
    userId,
    title,
    description,
    runChoice,
    runDateTime,
    recurringDays,
    urls,
  } = req.body;

  console.log("Request Body:", req.body);

  try {
    const user = await User.findByEmail(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let runNow = null;
    const utcDate = moment.utc().toDate();

    let date = null;
    let stat = "Scheduled";
    let newRecurring = 0;

    if (runChoice === "Recurring") {
      if (!recurringDays) {
        newRecurring = 1;
      } else {
        newRecurring = recurringDays;
      }
      date = new Date(utcDate.getTime() + newRecurring * 24 * 60 * 60 * 1000);
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

    if (runChoice === "Run Once" && date) {
      // Schedule the test run
      schedule.scheduleJob(date, async function () {
        await runTest(testRunId);
      });
    }

    if (runChoice === "Recurring" && recurringDays) {
      // Schedule the job to run at the specified interval
      schedule.scheduleJob(
        { start: date, rule: `0 0 0 */${recurringDays} * *` }, // Runs every recurringDays
        async function () {
          await runTest(testRunId);
        }
      );
    }

    // If the test should run now
    if (runNow) {
      await runTest(testRunId);
      savedTestRun = await TestRun.findByIdAndUpdate(testRunId, {
        status: "Completed",
      }); // Update status after test completion
      console.log("savedTestRun2 = ", savedTestRun);
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
  console.log("Entered getAvailability");
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

module.exports = {
  performAvailabilityTest,
  getAvailabilityTestResults,
  deleteAvailabilityTest,
};
