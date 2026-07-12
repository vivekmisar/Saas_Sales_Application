const reportService = require('../services/report.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');

/**
 * Report controller — thin HTTP layer.
 *
 * Reports are nested under projects:
 *   /api/v1/projects/:projectId/reports
 *
 * File upload (Multer) is not wired in this phase — the create
 * endpoint currently accepts file metadata in the request body.
 * When Multer is added, the controller will read from `req.file`
 * instead of `req.body`.
 *
 * The `projectId` comes from `req.params.projectId`, which is set
 * by the nested route mount in project.routes.js.
 */

/**
 * POST /api/v1/projects/:projectId/reports
 * Body: { fileName, originalName, filePath, fileSize, mimeType }
 *
 * In the Multer phase, this will change to reading from req.file.
 * For now, accepts metadata directly for testing the report flow.
 */
const createReport = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const report = await reportService.createReport(req.user.id, projectId, req.body);
  return ApiResponse.success(res, 201, 'Report created successfully', { report });
});

/**
 * GET /api/v1/projects/:projectId/reports
 * Query: ?status=pending&page=1&limit=10
 */
const listReports = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const { status, page, limit } = req.query;

  const result = await reportService.listReports(req.user.id, projectId, {
    status,
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
  });

  return ApiResponse.success(res, 200, 'Reports fetched successfully', result);
});

/**
 * GET /api/v1/projects/:projectId/reports/:reportId
 */
const getReport = catchAsync(async (req, res) => {
  const { projectId, reportId } = req.params;
  const report = await reportService.getReportById(req.user.id, projectId, reportId);
  return ApiResponse.success(res, 200, 'Report fetched successfully', { report });
});

/**
 * DELETE /api/v1/projects/:projectId/reports/:reportId
 */
const deleteReport = catchAsync(async (req, res) => {
  const { projectId, reportId } = req.params;
  await reportService.deleteReport(req.user.id, projectId, reportId);
  return ApiResponse.success(res, 200, 'Report deleted successfully');
});

module.exports = { createReport, listReports, getReport, deleteReport };
