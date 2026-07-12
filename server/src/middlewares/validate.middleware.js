const AppError = require('../utils/AppError');

/**
 * Joi validation middleware factory.
 *
 * Returns an Express middleware that validates `req.body` against the
 * provided Joi schema.
 *
 * Why a factory function?
 * So you can use it inline in route definitions:
 *   router.post('/register', validate(registerSchema), controller);
 *
 * Options:
 * - `abortEarly: false`  → Collects ALL validation errors, not just the first.
 * - `stripUnknown: true`  → Removes any fields not defined in the schema.
 *   This prevents unexpected data from leaking into your controllers.
 *
 * @param {import('joi').ObjectSchema} schema - Joi validation schema
 */
const validate = (schema) => (req, _res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const message = error.details.map((detail) => detail.message).join(', ');
    return next(new AppError(message, 400));
  }

  // Replace req.body with the validated (and stripped) value.
  req.body = value;
  next();
};

module.exports = validate;
