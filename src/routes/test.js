const axios = require('axios');

const TEST_WEBHOOK_URL = 'http://localhost:3000'; // ToDo ngrok

const testPRMerged = async () => {
  console.log('🔹 Sending test PR merged event...');

  const payload = {
    action: 'closed',
    pull_request: {
      number: 42,
      merged_at: new Date().toISOString(),
      base: {
        repo: {
          owner: { login: 'test-user' },
          name: 'test-repo',
        },
      },
    },
  };

  try {
    const response = await axios.post(TEST_WEBHOOK_URL, payload, {
      headers: { 'x-github-event': 'pull_request' },
    });

    console.log('✅ Test successful:', response.status);
  } catch (error) {
    console.error('❌ Test failed:', error.response ? error.response.data : error.message);
  }
};

// Run the test
testPRMerged();