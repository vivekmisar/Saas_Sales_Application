const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * MongoDB connection handler.
 *
 * Called once from `server.js` before the HTTP server starts.
 * Uses the URI from the validated env config.
 *
 * Why a separate function instead of connecting inline?
 * - Testability: you can mock this in integration tests.
 * - Clarity: `server.js` reads as a clear boot sequence.
 * - Error handling: connection failure is caught in one place.
 */
const connectDB = async (uri) => {
  try {
    const conn = await mongoose.connect(uri);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection failed', { error: error.message });
    process.exit(1);
  }
};

module.exports = connectDB;
