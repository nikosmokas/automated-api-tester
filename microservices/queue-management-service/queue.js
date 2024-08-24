const Queue = require('bull');

// Create a new queue instance
const queue = new Queue('performance-test-queue', {
    redis: {
        host: 'localhost',
        port: 6379,
    },
});

// Function to add a job to the queue
async function addToQueue(jobName, data) {
    const job = await queue.add(jobName, data);
    return job;
}

// Process jobs in the queue
queue.process(async (job) => {
    console.log(`Processing job ${job.id} with name ${job.name}`);
    // Add your job processing logic here
});

module.exports = { addToQueue };
