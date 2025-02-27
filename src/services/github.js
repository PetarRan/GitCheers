const { octokit } = require('../config/auth');

async function postMilestoneComment(owner, repo, issueNumber, mergedPRs) {
  const comment = `🎉 Congratulations! We've reached ${mergedPRs} merged PRs! 🎉`;
  return octokit.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body: comment,
  });
}

module.exports = { postMilestoneComment };