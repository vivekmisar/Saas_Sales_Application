const { Router } = require('express');
const {
  createReport,
  listReports,
  getReport,
  deleteReport,
} = require('../controllers/report.controller');
const upload = require('../middlewares/upload.middleware');
const validateCsv = require('../middlewares/validateCsv.middleware');

/**
 * Report routes — nested under /api/v1/projects/:projectId/reports
 *
 * Upload pipeline (order matters):
 *   1. upload.single('file') — Multer saves the file to disk and populates req.file
 *   2. validateCsv           — reads first lines, checks structure, populates req.csvMeta
 *   3. createReport          — persists metadata to MongoDB
 *
 * Auth is enforced by the parent project router — no need to repeat it here.
 * mergeParams: true gives access to :projectId from the parent router.
 */
const router = Router({ mergeParams: true });

router.post('/', upload.single('file'), validateCsv, createReport);
router.get('/', listReports);
router.get('/:reportId', getReport);
router.delete('/:reportId', deleteReport);

module.exports = router;
