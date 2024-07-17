require("dotenv").config();

const mongoURI =
  "mongodb+srv://nikossmokas:dU1nwBSHJSUui8Ck@automatedtestscluster.zfklqfu.mongodb.net/";

const express = require("express");
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
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define routes
app.use("/api", authRoutes); // Prefix for auth routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
