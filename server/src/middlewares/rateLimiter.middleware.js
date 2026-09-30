const rateLimit = require('express-rate-limit');

/**
 * Rate limiting middleware factory.
 *
 * Three tiers:
 *   1. globalLimiter — applies to every request (100 req / 15 min)
 *   2. authLimiter   — login/register only (10 req / 15 min)
 *   3. uploadLimiter  — file uploads (20 req / 15 min)
 *
 * Uses the standard `Retry-After` header and returns a JSON body
 * that matches our ApiResponse format.
 */

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false,  // Disable `X-RateLimit-*` headers
    message: {
      success: false,
      statusCode: 429,
      message,
      data: null,
    },
  });

const globalLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  100,
  'Too many requests. Please try again in a few minutes.',
);

const authLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  'Too many login attempts. Please try again in 15 minutes.',
);

const uploadLimiter = createLimiter(
  15 * 60 * 1000,
  20,
  'Too many uploads. Please try again later.',
);

module.exports = { globalLimiter, authLimiter, uploadLimiter };
