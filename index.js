require('dotenv').config();
const express = require('express');
const app = express();

// Ensure Express correctly parses JSON and URL-encoded requests
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Debug: Capture every request
app.use((req, res, next) => {
    console.log(`🔹 Received request: ${req.method} ${req.baseUrl}${req.path}`);
    console.log('📩 Headers:', req.headers);
    next();
});

// Catch-All POST Route (since GitHub might not be sending it to `/webhook`)
app.post('*', (req, res) => {
    console.log('✅ Webhook request received at CATCH-ALL POST route');

    const event = req.headers['x-github-event'];
    console.log(`🔹 GitHub event type: ${event}`);

    if (event === 'pull_request' && req.body.pull_request) {
        const action = req.body.action;
        const prTitle = req.body.pull_request.title;
        const prUser = req.body.pull_request.user.login;

        console.log(`🎉 Pull request ${action}: "${prTitle}" by ${prUser}`);
    } else {
        console.log('⚠️ Received an event, but no pull request data found.');
    }

    res.sendStatus(200);
});

// Debugging Route (to check if server is running)
app.get('/test', (req, res) => {
    res.send('✅ GitCheers bot is running!');
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 GitCheers bot listening on port ${PORT}`);
});