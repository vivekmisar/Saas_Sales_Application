const { Router } = require('express');
const {
  createReport,
  listReports,
  getReport,
  deleteReport,
} = require('../controllers/report.controller');

/**
 * Report routes.
 *
 * Mounted under /api/v1/projects/:projectId/reports
 * (see project.routes.js).
 *
 * `mergeParams: true` is critical — it gives this router access
 * to `:projectId` from the parent router.  Without it,
 * `req.params.projectId` would be undefined.
 *
 * Authentication is already applied by the parent project router,
 * so we don't need to repeat `isAuthenticated` here.
 */
const router = Router({ mergeParams: true });

router.post('/', createReport);
router.get('/', listReports);
router.get('/:reportId', getReport);
router.delete('/:reportId', deleteReport);

module.exports = router;
