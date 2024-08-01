const TestRun = require('../../models/AvailabilityTestRun');

async function cleanupOldResults() {
  try {
    // Define the cutoff date (10 days ago)
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);

    // Find test results to be deleted
    const results = await TestRun.find({
      status: { $in: ['Completed', 'Scheduled'] },  // Status must be either "completed" or "scheduled"
      createdAt: { $lt: tenDaysAgo },                // Older than 10 days
      nextRun: { $lt: new Date() }                   // nextRun must not be in the future
    });

    // Log the number of results found
    console.log(`Found ${results.length} test results to delete`);

    // Delete the found results
    const result = await TestRun.deleteMany({
      _id: { $in: results.map(r => r._id) }  // Delete by IDs of the found results
    });

    // Log the number of results deleted
    console.log(`Deleted ${result.deletedCount} old test results`);
  } catch (error) {
    console.error('Error cleaning up old test results:', error);
  }
}
module.exports = cleanupOldResults;