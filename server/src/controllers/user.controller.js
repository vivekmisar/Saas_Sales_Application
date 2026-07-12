const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

/**
 * User profile controller — thin HTTP layer.
 *
 * All profile operations require authentication (enforced at
 * the route level via `isAuthenticated` middleware).  The user
 * ID comes from `req.user.id` (set by Passport's deserializeUser).
 */

/**
 * GET /api/v1/users/profile
 * Returns the authenticated user's full profile.
 */
const getProfile = catchAsync(async (req, res) => {
  return ApiResponse.success(res, 200, 'Profile fetched successfully', {
    user: req.user,
  });
});

/**
 * PATCH /api/v1/users/profile
 * Body: { name?, avatar? }
 *
 * Why PATCH instead of PUT?
 * PATCH means "partial update" — the client sends only the fields
 * they want to change.  PUT means "full replacement" — every field
 * must be sent.  For profile updates, PATCH is the correct semantics.
 */
const updateProfile = catchAsync(async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  return ApiResponse.success(res, 200, 'Profile updated successfully', { user });
});

/**
 * PATCH /api/v1/users/change-password
 * Body: { currentPassword, newPassword, confirmPassword }
 */
const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await userService.changePassword(req.user.id, currentPassword, newPassword);
  return ApiResponse.success(res, 200, 'Password changed successfully');
});

/**
 * DELETE /api/v1/users/deactivate
 *
 * Soft-deletes the account.  The session is destroyed so the user
 * is logged out immediately.  The account data remains in MongoDB
 * but `isActive: false` prevents future logins.
 */
const deactivateAccount = catchAsync(async (req, res) => {
  await userService.deactivateAccount(req.user.id);

  // Destroy session — the user should not remain logged in.
  req.logout((err) => {
    if (err) throw err;
  });

  req.session.destroy((err) => {
    if (err) throw err;
    res.clearCookie('connect.sid');
    return ApiResponse.success(res, 200, 'Account deactivated successfully');
  });
});

module.exports = { getProfile, updateProfile, changePassword, deactivateAccount };
