require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// Webhook Listener for GitHub Events
app.post('/webhook', (req, res) => {
    const event = req.headers['x-github-event'];
    console.log(`Received GitHub event: ${event}`, req.body);

    if (event === 'pull_request') {
        const action = req.body.action;
        const prTitle = req.body.pull_request.title;
        const prUser = req.body.pull_request.user.login;
        
        console.log(`Pull request ${action}: ${prTitle} by ${prUser}`);

        // TODO: Add logic for tracking PR milestones here
    }

    res.sendStatus(200);
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`GitCheers bot listening on port ${PORT}`);
});
