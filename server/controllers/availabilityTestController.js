const express = require("express");
const axios = require("axios");
const TestResult = require("../models/AvailabilityTestResult");
const User = require("../models/User");
const TestRun = require("../models/AvailabilityTestRun");

const performAvailabilityTest = async (req, res) => {
  const { urls, userId } = req.body;

  try {
    // Find the user by userId (you may need to authenticate and authorize this)
    const user = await User.findByEmail(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new TestRun document
    const newTestRun = new TestRun({ user: userId });
    const savedTestRun = await newTestRun.save();
    const testRunId = savedTestRun._id;

    // Perform availability test on each URL
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
        availability,
        result, // Include the determined result
      });
      const savedResult = await newTestResult.save();
      testResults.push(savedResult);
    }

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
