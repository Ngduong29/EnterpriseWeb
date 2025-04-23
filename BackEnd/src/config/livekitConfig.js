// src/config/livekitConfig.js
require('dotenv').config();

module.exports = {
  apiKey: process.env.LIVEKIT_API_KEY || 'devkey',
  apiSecret: process.env.LIVEKIT_API_SECRET || 'secret',
  wsUrl: process.env.LIVEKIT_URL || 'wss://your-livekit-instance.livekit.cloud'
};