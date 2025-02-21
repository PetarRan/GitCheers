require('dotenv').config();
const express = require('express');
const app = express();

// Ensure Express correctly parses JSON and URL-encoded requests
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Debug: Capture every request
app.use((req, res, next) => {
    console.debug(`🔹 Received request: ${req.method} ${req.baseUrl}${req.path}`);
    console.debug('📩 Headers:', req.headers);
    next();
});

// Catch-All POST Route (since GitHub might not be sending it to `/webhook`)
app.post('*', async (req, res) => {
    console.debug('✅ Webhook request received at CATCH-ALL POST route');

    const event = req.headers['x-github-event'];
    console.debug(`🔹 GitHub event type: ${event}`);

    if (event === 'pull_request' && req.body.pull_request) {
        const prObject = req.body.pull_request;
        const action = req.body.action;

        const prNumber = prObject?.number
        const prTitle = prObject.title;
        const prUser = prObject.user.login;

        const response = await fetch(`https://api.github.com/repos/{owner}/{repo}/pulls?state=closed`);
        const prData = await response.json();

        const totalMergedPrs = prData.filter( pr => pr.merged_at != null).length;
        
        if (mergedPrs % 100 === 0) {
            // Post a milestone notification, e.g., a comment
            const comment = `🎉 Congratulations! We've reached ${mergedPrs} merged PRs! 🎉`;
            await fetch(`https://api.github.com/repos/{owner}/{repo}/issues/${prNumber}/comments`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ body: comment })
            });
        }


        console.debug(`🎉 Pull request ${action}: #${prNumber} "${prTitle}" by ${prUser}`);
    } else {
        console.debug('⚠️ Received an event, but no pull request data found.');
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