const express = require('express');
const router = express.Router();
const { postMilestoneComment } = require('../services/github');

let milestones = { mergedPRs: 0, closedIssues: 0 };

router.post('*', async (req, res) => {
  const event = req.headers['x-github-event'];
  console.debug(`🔹 GitHub event type: ${event}`);

  if (event === 'pull_request' && req.body.pull_request) {
    const prObject = req.body.pull_request;
    const action = req.body.action;

    if (action === 'closed' && prObject.merged_at) {
      milestones.mergedPRs++;
      if (milestones.mergedPRs % 100 === 0) {
        await postMilestoneComment(
          prObject.base.repo.owner.login,
          prObject.base.repo.name,
          prObject.number,
          milestones.mergedPRs
        );
      }
    }
  }

  res.sendStatus(200);
});

module.exports = router;