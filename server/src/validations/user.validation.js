const Joi = require('joi');

/**
 * Joi validation schemas for user profile routes.
 *
 * Separated from auth.validation.js because profile operations
 * have different rules (e.g., update allows partial data,
 * changePassword requires both old and new passwords).
 */

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).messages({
    'string.min': 'Name must be at least 3 characters',
    'string.max': 'Name must be at most 50 characters',
  }),
  avatar: Joi.string().uri().allow(null, '').messages({
    'string.uri': 'Avatar must be a valid URL',
  }),
})
  .min(1) // At least one field must be provided.
  .messages({
    'object.min': 'Please provide at least one field to update',
  });

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'any.required': 'Current password is required',
  }),
  newPassword: Joi.string().min(8).required().messages({
    'string.min': 'New password must be at least 8 characters',
    'any.required': 'New password is required',
  }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Please confirm your new password',
    }),
});

module.exports = { updateProfileSchema, changePasswordSchema };
