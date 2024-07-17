const express = require("express");
const axios = require("axios");
const TestResult = require("../models/AvailabilityTestResult");
const User = require("../models/User");
const TestRun = require("../models/AvailabilityTestRun");
const moment = require("moment");

const performAvailabilityTest = async (req, res) => {
  const {
    userId,
    urls,
    title,
    description,
    runChoice,
    runDateTime,
    recurringDays,
  } = req.body;

  console.log("Request Body:", req.body);

  try {
    // Find the user by userId (you may need to authenticate and authorize this)
    const user = await User.findByEmail(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let runNow = null;
    const utcDate = moment.utc().toDate();

    let date = null;

    console.log(utcDate.getTime());

    if (runChoice === "Recurring") {
      date = new Date(utcDate.getTime() + recurringDays * 24 * 60 * 60 * 1000);
    } else if (runChoice === "Run Once") {
      if (runDateTime === null || runDateTime === "") {
        date = new Date(utcDate.getTime() + 60 * 1000);
      } else {
        date = runDateTime;
      }
    } else {
      runNow = new Date(utcDate.getTime());
    }

    console.log(date);

    // Create a new TestRun document
    const newTestRun = new TestRun({
      user: userId,
      title: title || "Untitled", // Provide default values if not present
      description: description || "No description",
      status: runChoice, // Assuming a default status of 'pending'
      nextRun: date || null,
      lastRun: runNow || null,
      recurrency: recurringDays || 1,
    });
    const savedTestRun = await newTestRun.save();
    const testRunId = savedTestRun._id;

    // Perform availability test on each URL IF NOW ((YOU NEED TO CHANGE THIS IN CASE IT'S RECURRING OR SHOULD RUN LATER))
    const testResults = [];
    for (const url of urls) {
      // Perform availability test logic
      const availability = await performAvailabilityCheck(url);

      // Determine result based on availability status
      let result;
      console.log(availability);
      if (availability === "available") {
        result = "Success";
      } else if (availability === "not available") {
        result = "Failed";
      } else {
        result = availability;
      }

      // Save test result to database
      const newTestResult = new TestResult({
        user: userId,
        testRun: testRunId,
        url,
        result, // Include the determined result
      });
      const savedResult = await newTestResult.save();
      testResults.push(savedResult);
    }

    // Update the status of the TestRun to "Completed"
    await TestRun.findByIdAndUpdate(testRunId, { status: "Completed" });

    res.status(200).json({
      message: "Availability tests completed and results saved",
      results: testResults,
    });
  } catch (error) {
    console.error("Error performing availability test:", error);
    res.status(500).json({ message: "Failed to perform availability test" });
  }
};

// Simulated function to perform availability check (replace with your logic)
const performAvailabilityCheck = async (url) => {
  // Example: Simulating an API call to check availability
  try {
    const response = await axios.get(url);
    return response.status === 200 ? "available" : "not available";
  } catch (error) {
    console.error(`Error checking availability for ${url}:`, error.message);
    if (error.response) {
      // The request was made and the server responded with a status code outside of the range 2xx
      switch (error.response.status) {
        case 400:
          return "Bad Request";
        case 401:
          return "Unauthorized";
        case 403:
          return "Forbidden";
        case 404:
          return "Not Found";
        case 500:
          return "Internal Server Error";
        case 502:
          return "Bad Gateway";
        case 503:
          return "Service Unavailable";
        default:
          return "Error";
      }
    }
    return "Error";
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

module.exports = {
  performAvailabilityTest,
  getAvailabilityTestResults,
};
