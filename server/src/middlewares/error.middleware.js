const logger = require('../utils/logger');
const ApiResponse = require('../utils/ApiResponse');

/**
 * Global error-handling middleware.
 *
 * Express identifies error handlers by their 4-argument signature
 * (err, req, res, next).  This MUST be the last middleware mounted.
 *
 * Behaviour:
 * - Operational errors (AppError with isOperational = true):
 *   → Sends the error's own statusCode and message.
 *   → These are expected errors (bad input, not found, unauthorized).
 *
 * - Programming errors (anything else):
 *   → Logs the full stack trace.
 *   → Sends a generic 500 "Internal Server Error".
 *   → Never leaks implementation details to the client.
 *
 * - Development mode adds the stack trace to the response for debugging.
 */

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Log all errors — operational get `warn`, unexpected get `error`.
  if (err.isOperational) {
    logger.warn(err.message, { statusCode: err.statusCode, path: req.originalUrl });
  } else {
    logger.error('UNEXPECTED ERROR', {
      message: err.message,
      stack: err.stack,
      path: req.originalUrl,
    });
  }

  // ── Mongoose-specific error transforms ──────────────────────
  // Duplicate key (e.g., unique email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ');
    err.message = `Duplicate value for: ${field}`;
    err.statusCode = 409;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    err.message = messages.join(', ');
    err.statusCode = 400;
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    err.message = `Invalid ${err.path}: ${err.value}`;
    err.statusCode = 400;
  }

  // ── Send response ──────────────────────────────────────────
  const response = {
    success: false,
    statusCode: err.statusCode,
    message: err.isOperational ? err.message : 'Internal Server Error',
    data: null,
  };

  // In development, include the stack trace for debugging.
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  return res.status(err.statusCode).json(response);
};

module.exports = errorHandler;
