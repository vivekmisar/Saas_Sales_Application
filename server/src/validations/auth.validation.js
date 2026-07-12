const Joi = require('joi');

/**
 * Joi validation schemas for authentication routes.
 *
 * Why separate from controllers?
 * - Schemas are reusable (same email rule in register and login).
 * - Controllers stay thin — they don't define validation logic.
 * - Easy to unit test schemas in isolation.
 *
 * These schemas are consumed by `validate.middleware.js`, which
 * validates `req.body` and throws an AppError on failure.
 */

const registerSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required().messages({
    'string.min': 'Name must be at least 3 characters',
    'string.max': 'Name must be at most 50 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().lowercase().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

module.exports = { registerSchema, loginSchema };
