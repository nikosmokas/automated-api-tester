// Override console.log to include timestamps
const originalLog = console.log;

console.log = function (...args) {
  const timestamp = new Date().toISOString();
  originalLog.apply(console, [timestamp, ...args]);
};

const schedule = require('node-schedule');
require("dotenv").config();
const {
  scheduleRunOnceTests,
  scheduleRecurringTests,
} = require("./tools/schedulers/scheduler");
const { runTest } = require("./tools/scripts/availabilityTestRun");
const cleanupOldResults = require('./tools/schedulers/cleanupOldResults');
const markMissedTestsAsCancelled = require('./tools/scripts/markMissedTestsAsCancelled');

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const cors = require("cors");

const app = express();

// Body parser middleware
app.use(express.json()); // Body parser middleware
app.use(cors()); // Enable CORS

// Use environment variable or default URI
const mongoURI = process.env.MONGO_URI || "mongodb+srv://nikossmokas:dU1nwBSHJSUui8Ck@automatedtestscluster.zfklqfu.mongodb.net/";

mongoose
  .connect(mongoURI, {})
  .then(() => {
    console.log("MongoDB Connected");

    // Schedule any tests that should run
    scheduleRunOnceTests();
    scheduleRecurringTests(runTest);
    schedule.scheduleJob('0 0 * * *', cleanupOldResults); // Runs daily at midnight
    markMissedTestsAsCancelled();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Define routes
app.use("/api", authRoutes); // Prefix for auth routes

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/build")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
