const { Router } = require('express');
const {
  getProfile,
  updateProfile,
  changePassword,
  deactivateAccount,
} = require('../controllers/user.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  updateProfileSchema,
  changePasswordSchema,
} = require('../validations/user.validation');

/**
 * User profile routes.
 *
 * Every route is protected by `isAuthenticated`.  Instead of
 * repeating the middleware on each route, we apply it once to
 * the entire router via `router.use()`.
 *
 * Why not nest under /auth?
 * Authentication (register/login/logout) and user profile
 * management (update/password/deactivate) are separate concerns.
 * Keeping them in different route modules follows REST conventions:
 *   /api/v1/auth/*   → identity operations
 *   /api/v1/users/*  → resource operations on the user entity
 */
const router = Router();

// All user routes require authentication.
router.use(isAuthenticated);

router.get('/profile', getProfile);
router.patch('/profile', validate(updateProfileSchema), updateProfile);
router.patch('/change-password', validate(changePasswordSchema), changePassword);
router.delete('/deactivate', deactivateAccount);

module.exports = router;
