const { Router } = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const projectRoutes = require('./project.routes');

/**
 * Route aggregator.
 *
 * All route modules are mounted here under a versioned prefix.
 * `app.js` imports only this file — clean single-point entry.
 *
 * Current routes:
 *   /api/v1/auth/*                              → Authentication
 *   /api/v1/users/*                             → User profile
 *   /api/v1/projects/*                          → Project CRUD
 *   /api/v1/projects/:projectId/reports/*       → Report CRUD (nested)
 */
const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);

module.exports = router;
