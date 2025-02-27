require('dotenv').config();
const express = require('express');
const webhookRoutes = require('./src/routes/webhook');
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/webhook', webhookRoutes);

app.get('/test', (req, res) => {
  res.send('✅ GitCheers bot is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 GitCheers bot listening on port ${PORT}`);
});