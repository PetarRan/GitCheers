require('dotenv').config();
const express = require('express');
const { createAppAuth } = require('@octokit/auth-app');
const { Octokit } = require('@octokit/rest');
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// GH Auth, more in README.md (#auth)
const auth = createAppAuth({
  appId: process.env.APP_ID,
  privateKey: process.env.PRIVATE_KEY,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

const octokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId: process.env.APP_ID,
    privateKey: process.env.PRIVATE_KEY,
  },
});

// In-mem, serverless. N eed to initialize this crap.
let milestones = {
  mergedPRs: 0,
  closedIssues: 0,
};

// debug logging
app.use((req, res, next) => {
  console.debug(`🔹 Received request: ${req.method} ${req.baseUrl}${req.path}`);
  next();
});

// Webhook Handler, /webhook catch didn't work?
// ToDo: Need to revisit
app.post('*', async (req, res) => {
  const event = req.headers['x-github-event'];
  console.debug(`🔹 GitHub event type: ${event}`);

  if (event === 'pull_request' && req.body.pull_request) {
    const prObject = req.body.pull_request;
    const action = req.body.action;

    if (action === 'closed' && prObject.merged_at) {
      milestones.mergedPRs++;
      if (milestones.mergedPRs % 100 === 0) {
        const comment = `🎉 Congratulations! We've reached ${milestones.mergedPRs} merged PRs! 🎉`;
        await octokit.issues.createComment({
          owner: prObject.base.repo.owner.login,
          repo: prObject.base.repo.name,
          issue_number: prObject.number,
          body: comment,
        });
      }
    }
  }

  res.sendStatus(200);
});

app.get('/test', (req, res) => {
  res.send('✅ GitCheers bot is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 GitCheers bot listening on port ${PORT}`);
});