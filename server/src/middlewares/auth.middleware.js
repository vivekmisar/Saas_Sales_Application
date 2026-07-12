const AppError = require('../utils/AppError');

/**
 * Authentication guard middleware.
 *
 * Checks if the request has an authenticated session (via Passport).
 * If not, returns 401.  Attach this to any route that requires login:
 *
 *   router.get('/me', isAuthenticated, getMe);
 *
 * Why not check `req.session` directly?
 * `req.isAuthenticated()` is Passport's official API.  It accounts for
 * edge cases like expired sessions and deserialization failures.
 */
const isAuthenticated = (req, _res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return next(new AppError('Authentication required. Please log in.', 401));
};

module.exports = { isAuthenticated };
