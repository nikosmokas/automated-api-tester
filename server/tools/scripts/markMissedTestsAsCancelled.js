const TestRun = require("../../models/AvailabilityTestRun");

const markMissedTestsAsCancelled = async () => {
  try {
    const currentTime = new Date();

    // Find tests that are scheduled but haven't been run yet
    const testsToCancel = await TestRun.find({
      status: 'Scheduled',
      nextRun: { $lt: currentTime }
    });

    if (testsToCancel.length > 0) {
      // Update status to "Cancelled"
      await TestRun.updateMany(
        {
          _id: { $in: testsToCancel.map(test => test._id) }
        },
        { status: 'Cancelled' }
      );

      console.log(`Marked ${testsToCancel.length} tests as Cancelled.`);
    } else {
      console.log('No missed tests to mark as Cancelled.');
    }
  } catch (error) {
    console.error('Error marking missed tests as Cancelled:', error);
  }
};

module.exports = markMissedTestsAsCancelled;
