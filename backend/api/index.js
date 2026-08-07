const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const app = require('../app');
const connectDB = require('../config/db');
const { preflightEmailAuth } = require('../services/emailService');

let emailPreflightStarted = false;

// Vercel serverless: no long-running process, so connect/verify lazily per invocation
// (connectDB/preflightEmailAuth cache their state, so warm invocations skip the work).
module.exports = async (req, res) => {
  await connectDB();

  if (!emailPreflightStarted) {
    emailPreflightStarted = true;
    preflightEmailAuth().catch((error) => {
      console.error('Email preflight failed:', error.message);
    });
  }

  return app(req, res);
};
