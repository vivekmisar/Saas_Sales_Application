/**
 * Async error wrapper for Express route handlers.
 *
 * Eliminates try/catch boilerplate in every controller.  Wraps an
 * async function and forwards any rejected promise to Express's
 * `next()`, which hands it to the global error handler.
 *
 * Usage:
 *   router.get('/users', catchAsync(async (req, res) => { ... }));
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;
