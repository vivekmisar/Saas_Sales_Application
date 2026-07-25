const fs = require('fs');
const axios = require('axios');
const reportService = require('../services/report.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * FastAPI analytics engine URL.
 * In production this would come from env vars; hardcoded for local dev.
 */
const ANALYTICS_ENGINE_URL = process.env.ANALYTICS_ENGINE_URL || 'http://localhost:8000';

/**
 * POST /api/v1/projects/:projectId/reports
 *
 * Full pipeline:
 *   1. Multer saves file to disk, validateCsv checks structure
 *   2. Create report in MongoDB (status: pending)
 *   3. Set status → processing
 *   4. Forward file path to FastAPI /api/v1/analyze
 *   5. On success → store analytics, set status → completed
 *   6. On failure → set status → failed
 *   7. Return the fully-populated report to the client
 *
 * Design: Synchronous processing. The user waits for the result in
 * one request cycle. This is acceptable for files under 10MB and
 * avoids the complexity of async job queues + polling.
 */
const createReport = catchAsync(async (req, res) => {
  const { projectId } = req.params;

  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  const fileData = {
    originalName: req.file.originalname,
    fileName: req.file.filename,
    filePath: req.file.path,
    fileSize: req.file.size,
    mimeType: req.file.mimetype,
  };

  // Step 1: Create report (status defaults to 'pending')
  let report = await reportService.createReport(req.user.id, projectId, fileData);

  // Step 2: Set status → processing
  report = await reportService.updateReportStatus(report._id, 'processing');

  try {
    // Step 3: Call FastAPI analytics engine
    const { data: analytics } = await axios.post(
      `${ANALYTICS_ENGINE_URL}/api/v1/analyze`,
      { file_path: req.file.path },
      { timeout: 30000 } // 30s timeout for large files
    );

    // Step 4: Store analytics + set status → completed
    report = await reportService.updateReportStatus(report._id, 'completed', analytics);

    logger.info('Analytics processed successfully', {
      reportId: report._id,
      projectId,
    });
  } catch (err) {
    // Step 5: On failure → mark as failed but don't crash the request
    logger.error('Analytics engine error', {
      reportId: report._id,
      error: err.response?.data?.detail || err.message,
    });

    report = await reportService.updateReportStatus(report._id, 'failed');
  }

  return ApiResponse.success(res, 201, 'Report created successfully', {
    report,
    csvMeta: req.csvMeta || null,
  });
});

/**
 * GET /api/v1/projects/:projectId/reports
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
  const report = await reportService.deleteReport(req.user.id, projectId, reportId);

  if (report?.filePath) {
    fs.unlink(report.filePath, () => {});
  }

  return ApiResponse.success(res, 200, 'Report deleted successfully');
});

module.exports = { createReport, listReports, getReport, deleteReport };
