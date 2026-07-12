const { Router } = require('express');
const {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
} = require('../controllers/project.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createProjectSchema,
  updateProjectSchema,
} = require('../validations/project.validation');
const reportRoutes = require('./report.routes');

/**
 * Project routes.
 *
 * All routes require authentication (applied via router.use).
 *
 * Report routes are nested here:
 *   /api/v1/projects/:projectId/reports/*
 *
 * Why nest reports under projects?
 * Because a report only makes sense in the context of a project.
 * The URL structure reflects the data model hierarchy:
 *   User → Project → Report
 *
 * `mergeParams: true` in the report router gives it access to
 * `:projectId` from this parent router.
 */
const router = Router();

// All project routes require authentication.
router.use(isAuthenticated);

router.post('/', validate(createProjectSchema), createProject);
router.get('/', listProjects);
router.get('/:projectId', getProject);
router.patch('/:projectId', validate(updateProjectSchema), updateProject);
router.delete('/:projectId', deleteProject);

// ── Nested report routes ────────────────────────────────────────
router.use('/:projectId/reports', reportRoutes);

module.exports = router;
