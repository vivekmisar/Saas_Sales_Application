const User = require('../models/user.model');
const AppError = require('../utils/AppError');

/**
 * User profile service — business logic for profile operations.
 *
 * Separated from auth.service because authentication (register,
 * login, logout) and profile management (update name, change
 * password, deactivate) are different concerns.  As the app grows,
 * auth might need rate limiting while profile doesn't, or profile
 * might get caching while auth shouldn't.
 */

/**
 * Update user profile (name, avatar).
 *
 * Only allows updating safe fields.  Email and password changes
 * have their own dedicated endpoints with additional checks.
 *
 * @param {string} userId - MongoDB ObjectId
 * @param {Object} updates - { name?, avatar? }
 * @returns {Object} Updated user
 * @throws {AppError} 404 if user not found
 */
const updateProfile = async (userId, updates) => {
  // Whitelist: only these fields can be updated via this method.
  const allowedFields = ['name', 'avatar'];
  const sanitized = {};

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      sanitized[field] = updates[field];
    }
  }

  const user = await User.findByIdAndUpdate(userId, sanitized, {
    new: true,           // Return the updated document
    runValidators: true, // Re-run schema validators on update
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

/**
 * Change user password.
 *
 * Requires the current password for verification — prevents
 * someone with a stolen session from changing the password
 * without knowing the original.
 *
 * Uses `.save()` instead of `findByIdAndUpdate` so the pre-save
 * hook runs and hashes the new password automatically.
 *
 * @param {string} userId
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns {Object} Updated user
 * @throws {AppError} 401 if current password is wrong
 */
const changePassword = async (userId, currentPassword, newPassword) => {
  // Must select password explicitly since it's hidden by default.
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError('Current password is incorrect', 401);
  }

  // Assign and save — triggers the pre-save hook for hashing.
  user.password = newPassword;
  await user.save();

  return user.toJSON();
};

/**
 * Deactivate user account (soft delete).
 *
 * Why soft delete instead of hard delete?
 * - Data can be recovered if a user changes their mind.
 * - Referential integrity: other collections may reference this user.
 * - Analytics and audit trails remain intact.
 * - Admins can review deactivated accounts.
 *
 * @param {string} userId
 * @returns {Object} Deactivated user
 * @throws {AppError} 404 if user not found
 */
const deactivateAccount = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: false },
    { new: true },
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

module.exports = { updateProfile, changePassword, deactivateAccount };
