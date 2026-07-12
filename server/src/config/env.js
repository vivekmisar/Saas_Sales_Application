const dotenv = require('dotenv');
const path = require('path');

/**
 * Environment configuration.
 *
 * Loads `.env` from the server root, validates that every required
 * variable is present, and exports a frozen config object.
 *
 * This file is imported FIRST in `server.js` — before anything else
 * touches `process.env` — so every module downstream can rely on
 * these values being available.
 *
 * Why validate here instead of letting things fail randomly later?
 * Because a missing SESSION_SECRET at startup is an obvious fix,
 * but a missing SESSION_SECRET at runtime (when a user tries to
 * log in) is a debugging nightmare.
 */

dotenv.config({ path: path.join(__dirname, '../../.env') });

const REQUIRED_VARS = ['MONGODB_URI', 'SESSION_SECRET'];

REQUIRED_VARS.forEach((key) => {
  if (!process.env[key]) {
    console.error(`FATAL: Missing required environment variable: ${key}`);
    console.error('Copy .env.example to .env and fill in the values.');
    process.exit(1);
  }
});

const env = Object.freeze({
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  SESSION_SECRET: process.env.SESSION_SECRET,
});

module.exports = env;
