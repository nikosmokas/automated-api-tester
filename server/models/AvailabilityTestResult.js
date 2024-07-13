const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testResultSchema = new Schema({
  user: { type: String, ref: "User", required: true },
  testRun: { type: Schema.Types.ObjectId, ref: "TestRun", required: true },
  url: { type: String, required: true },
  result: {
    type: String,
    enum: [
      "Success",
      "Failed",
      "Error",
      "Bad Request",
      "Unauthorized",
      "Forbidden",
      "Not Found",
      "Internal Server Error",
      "Bad Gateway",
      "Service Unavailable",
    ],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

const TestResult = mongoose.model("TestResult", testResultSchema);

module.exports = TestResult;
