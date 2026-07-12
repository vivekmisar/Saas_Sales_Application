const User = require('../models/user.model');
const AppError = require('../utils/AppError');

/**
 * Authentication service — business logic layer.
 *
 * Why a service layer between controllers and models?
 *
 * 1. Controllers handle HTTP (parse request, send response).
 * 2. Services handle LOGIC (create user, check duplicates).
 * 3. Models handle DATA (schema, validation, persistence).
 *
 * This means:
 * - Business rules are testable without spinning up Express.
 * - Multiple controllers (REST, GraphQL, CLI) can reuse the same logic.
 * - Controllers never import Mongoose models directly.
 */

/**
 * Register a new user.
 * @param {Object} userData - { name, email, password }
 * @returns {Object} Created user (without password)
 * @throws {AppError} 409 if email already exists
 */
const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  const user = await User.create({ name, email, password });

  // toJSON transform in the schema strips password automatically,
  // but we call toJSON explicitly to be safe.
  return user.toJSON();
};

/**
 * Find user by ID.
 * @param {string} id - MongoDB ObjectId
 * @returns {Object} User without password
 * @throws {AppError} 404 if user not found
 */
const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

/**
 * Record a successful login.
 *
 * Called after Passport authenticates the user.  Updates the
 * `lastLogin` timestamp so admins can track user activity.
 *
 * @param {string} userId - MongoDB ObjectId
 */
const recordLogin = async (userId) => {
  await User.findByIdAndUpdate(userId, { lastLogin: new Date() });
};

module.exports = { register, getUserById, recordLogin };
