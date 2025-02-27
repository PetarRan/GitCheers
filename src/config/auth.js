require('dotenv').config();
const { createAppAuth } = require('@octokit/auth-app');
const { Octokit } = require('@octokit/rest');

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

module.exports = { auth, octokit };