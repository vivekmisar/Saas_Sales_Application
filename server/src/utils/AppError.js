/**
 * Custom operational error class.
 *
 * Extends the native Error to include an HTTP status code and an
 * `isOperational` flag.  The global error handler uses `isOperational`
 * to decide whether to expose the message to the client (operational)
 * or return a generic "Internal Server Error" (programming bug).
 *
 * Usage:
 *   throw new AppError('User not found', 404);
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Keeps the stack trace clean — excludes the constructor call itself.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
