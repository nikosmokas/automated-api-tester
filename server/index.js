require("dotenv").config();
const {
  scheduleRunOnceTests,
  scheduleRecurringTests,
} = require("./tools/schedulers/scheduler");

const mongoURI =
  "mongodb+srv://nikossmokas:dU1nwBSHJSUui8Ck@automatedtestscluster.zfklqfu.mongodb.net/";

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const cors = require("cors");

const app = express();

// Body parser middleware
app.use(express.json()); // Body parser middleware
app.use(cors()); // Enable CORS

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");

    // Schedule any tests that should run once
    scheduleRunOnceTests();
    scheduleRecurringTests();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Define routes
app.use("/api", authRoutes); // Prefix for auth routes

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/build")));

// The "catchall" handler: for any request that doesn't match one above, send back the index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
