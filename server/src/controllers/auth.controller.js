const passport = require('passport');
const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');

/**
 * Auth controller — thin HTTP layer.
 *
 * Each handler:
 *  1. Extracts data from the request.
 *  2. Delegates to the service layer.
 *  3. Sends a standardised response via ApiResponse.
 *
 * No business logic lives here.  No direct Mongoose calls.
 * All wrapped in `catchAsync` — zero try/catch blocks.
 */

/**
 * POST /api/v1/auth/register
 * Body: { name, email, password }
 */
const register = catchAsync(async (req, res) => {
  const user = await authService.register(req.body);
  return ApiResponse.success(res, 201, 'User registered successfully', { user });
});

/**
 * POST /api/v1/auth/login
 * Body: { email, password }
 *
 * Passport's `authenticate` is callback-based, so we wrap it
 * manually rather than using it as middleware.  This gives us
 * control over the response format.
 *
 * After successful authentication, `req.logIn()` creates the
 * session and we record the login timestamp.
 */
const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return next(new AppError(info?.message || 'Invalid credentials', 401));
    }

    req.logIn(user, async (loginErr) => {
      if (loginErr) return next(loginErr);

      // Track login timestamp.
      await authService.recordLogin(user.id);

      return ApiResponse.success(res, 200, 'Logged in successfully', {
        user: user.toJSON(),
      });
    });
  })(req, res, next);
};

/**
 * POST /api/v1/auth/logout
 *
 * Passport's `req.logout()` clears the user from the session.
 * We then destroy the session document entirely and clear the
 * cookie so no stale session ID remains on the client.
 */
const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((destroyErr) => {
      if (destroyErr) return next(destroyErr);

      res.clearCookie('connect.sid');
      return ApiResponse.success(res, 200, 'Logged out successfully');
    });
  });
};

/**
 * GET /api/v1/auth/me
 * Returns the currently authenticated user.
 *
 * `req.user` is populated by Passport's `deserializeUser` on every
 * authenticated request.  We fetch fresh data from the service to
 * ensure the response reflects the latest state.
 */
const getMe = catchAsync(async (req, res) => {
  const user = await authService.getUserById(req.user.id);
  return ApiResponse.success(res, 200, 'User fetched successfully', { user });
});

/**
 * GET /api/v1/auth/status
 * Quick check — is the user currently authenticated?
 *
 * Useful for frontends to check session validity on page load
 * without fetching the full user profile.
 */
const checkAuthStatus = (req, res) => {
  return ApiResponse.success(res, 200, 'Auth status', {
    isAuthenticated: req.isAuthenticated(),
    user: req.isAuthenticated() ? req.user : null,
  });
};

module.exports = { register, login, logout, getMe, checkAuthStatus };
