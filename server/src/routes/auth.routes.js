const { Router } = require('express');
const {
  register,
  login,
  logout,
  getMe,
  checkAuthStatus,
} = require('../controllers/auth.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { registerSchema, loginSchema } = require('../validations/auth.validation');

/**
 * Auth routes.
 *
 * Route structure:
 *   validate(schema)  → Joi checks the body first
 *   isAuthenticated   → Session guard for protected routes
 *   controller        → Handles the request
 *
 * This reads top-to-bottom as a pipeline:
 *   "Validate → Authenticate → Handle"
 */
const router = Router();

// ── Public routes (no auth required) ────────────────────────────
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/status', checkAuthStatus);

// ── Protected routes ────────────────────────────────────────────
router.post('/logout', isAuthenticated, logout);
router.get('/me', isAuthenticated, getMe);

module.exports = router;
