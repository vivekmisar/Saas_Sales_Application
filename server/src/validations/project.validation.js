const Joi = require('joi');

/**
 * Joi validation schemas for project routes.
 */

const createProjectSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.min': 'Project name must be at least 2 characters',
    'string.max': 'Project name must be at most 100 characters',
    'any.required': 'Project name is required',
  }),
  description: Joi.string().trim().max(500).allow('').messages({
    'string.max': 'Description must be at most 500 characters',
  }),
});

const updateProjectSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).messages({
    'string.min': 'Project name must be at least 2 characters',
    'string.max': 'Project name must be at most 100 characters',
  }),
  description: Joi.string().trim().max(500).allow('').messages({
    'string.max': 'Description must be at most 500 characters',
  }),
  status: Joi.string().valid('active', 'archived').messages({
    'any.only': 'Status must be either active or archived',
  }),
})
  .min(1)
  .messages({
    'object.min': 'Please provide at least one field to update',
  });

module.exports = { createProjectSchema, updateProjectSchema };
