/**
 * Server entry point.
 *
 * Boot sequence:
 *  1. Load and validate environment variables (fail-fast).
 *  2. Connect to MongoDB.
 *  3. Import the Express app and start listening.
 *
 * Why this order?
 * - Env must load first — everything else depends on it.
 * - DB must connect before the server accepts requests.
 * - If either fails, the process exits with a clear error.
 *
 * Unhandled rejections and uncaught exceptions are caught here
 * as a safety net — they log the error and shut down gracefully.
 */

const env = require('./src/config/env');
const connectDB = require('./src/config/db');
const app = require('./src/app');
const logger = require('./src/utils/logger');

const startServer = async () => {
  // Step 1: Connect to MongoDB.
  await connectDB(env.MONGODB_URI);

  // Step 2: Start HTTP server.
  const server = app.listen(env.PORT, () => {
    logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });

  // ── Graceful shutdown on unhandled errors ───────────────────
  process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION — shutting down', { error: err.message });
    server.close(() => process.exit(1));
  });

  process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION — shutting down', { error: err.message });
    server.close(() => process.exit(1));
  });
};

startServer();

