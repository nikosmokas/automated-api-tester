const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testRunSchema = new Schema(
  {
    user: { type: String, ref: "User", required: true },
    title: { type: String, defualt: "Untitled" },
    description: { type: String, default: "No description" },
    status: { type: String, required: true },
    nextRun: { type: Date, default: null },
    lastRun: { type: Date, default: null },
    recurrency: { type: Number, default: null },
    urls: [{ type: String, required: true }],
  },
  {
    timestamps: true,
  }
);

const TestRun = mongoose.model("TestRun", testRunSchema);

module.exports = TestRun;
