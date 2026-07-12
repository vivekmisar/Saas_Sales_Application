const Joi = require('joi');

/**
 * Joi validation schemas for report routes.
 *
 * Reports are created via file upload (Multer handles the file).
 * The only user-provided field in the body is an optional
 * description — the rest (fileName, fileSize, etc.) comes from
 * Multer's `req.file` object in the controller.
 *
 * Query params for listing are validated here too.
 */

const listReportsQuerySchema = Joi.object({
  status: Joi.string().valid('pending', 'processing', 'completed', 'failed').messages({
    'any.only': 'Status must be pending, processing, completed, or failed',
  }),
  page: Joi.number().integer().min(1).default(1).messages({
    'number.min': 'Page must be at least 1',
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit must be at most 100',
  }),
});

module.exports = { listReportsQuerySchema };
