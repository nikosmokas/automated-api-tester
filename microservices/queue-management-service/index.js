const express = require('express');
const { addToQueue } = require('./queue');

const app = express();

// Use the PORT environment variable or default to 5001
const port = process.env.PORT || 5001;

app.use(express.json());

app.post('/add-job', async (req, res) => {
    const { jobName, data } = req.body;
    try {
        const job = await addToQueue(jobName, data);
        res.status(200).json({ message: 'Job added to the queue', jobId: job.id });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add job', error });
    }
});

app.listen(port, () => {
    console.log(`Queue Management Service running on port ${port}`);
});
