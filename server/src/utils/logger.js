const { createLogger, format, transports } = require('winston');
const path = require('path');

/**
 * Application-wide Winston logger.
 *
 * - Development : colourised, human-readable output to the console.
 * - Production  : JSON-formatted logs to both console and rotating files.
 *
 * Log files live in `server/logs/` (git-ignored).
 *
 * Usage:
 *   const logger = require('./utils/logger');
 *   logger.info('Server started on port %d', port);
 *   logger.error('DB connection failed', { error: err.message });
 */

const logDir = path.join(__dirname, '../../logs');

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
  ),
  transports: [
    // ── Console ──────────────────────────────────────────────
    new transports.Console({
      format:
        process.env.NODE_ENV === 'production'
          ? format.combine(format.json())
          : format.combine(format.colorize(), format.simple()),
    }),

    // ── Error log (errors only) ──────────────────────────────
    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: format.json(),
      maxsize: 5 * 1024 * 1024, // 5 MB
      maxFiles: 5,
    }),

    // ── Combined log (all levels) ────────────────────────────
    new transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: format.json(),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
});

module.exports = logger;
