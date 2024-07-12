const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testRunSchema = new Schema({
  user: { type: String, ref: 'User', required: true },
  // Other fields as needed (timestamps, status, etc.)
});

const TestRun = mongoose.model('TestRun', testRunSchema);

module.exports = TestRun;
