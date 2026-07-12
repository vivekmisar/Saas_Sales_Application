const Report = require('../models/report.model');
const Project = require('../models/project.model');
const AppError = require('../utils/AppError');

/**
 * Report service — business logic layer.
 *
 * Reports are nested under projects:
 *   /projects/:projectId/reports
 *
 * Every method verifies that the project belongs to the requesting
 * user before touching any report data.  This prevents cross-user
 * data leaks even if route params are tampered with.
 *
 * The `analytics` field is intentionally schema-less (Mixed).  When
 * FastAPI returns computed KPIs, the controller passes the JSON
 * directly to `updateReportAnalytics()` — no schema migration needed
 * regardless of what Python returns.
 */

/**
 * Verify project ownership.
 *
 * Extracted as a reusable helper because every report operation
 * needs this check.  Returns the project if valid, throws if not.
 *
 * @param {string} userId
 * @param {string} projectId
 * @returns {Object} Project document
 * @throws {AppError} 404 if project not found or not owned
 */
const verifyProjectOwnership = async (userId, projectId) => {
  const project = await Project.findOne({ _id: projectId, user: userId });
  if (!project) {
    throw new AppError('Project not found', 404);
  }
  return project;
};

/**
 * Create a report within a project.
 *
 * Called after file upload (Multer) provides file metadata.
 * Increments the project's `reportCount` for denormalized counting.
 *
 * @param {string} userId
 * @param {string} projectId
 * @param {Object} fileData - { fileName, originalName, filePath, fileSize, mimeType }
 * @returns {Object} Created report
 */
const createReport = async (userId, projectId, fileData) => {
  await verifyProjectOwnership(userId, projectId);

  const report = await Report.create({
    project: projectId,
    user: userId,
    ...fileData,
  });

  // Increment denormalized counter.
  await Project.findByIdAndUpdate(projectId, { $inc: { reportCount: 1 } });

  return report;
};

/**
 * List all reports in a project.
 *
 * Supports filtering by status and pagination.
 * Sorted by newest first (most recent uploads at the top).
 *
 * @param {string} userId
 * @param {string} projectId
 * @param {Object} options - { status?, page?, limit? }
 * @returns {Object} { reports, total, page, totalPages }
 */
const listReports = async (userId, projectId, { status, page = 1, limit = 10 } = {}) => {
  await verifyProjectOwnership(userId, projectId);

  const filter = { project: projectId, user: userId };
  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [reports, total] = await Promise.all([
    Report.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Report.countDocuments(filter),
  ]);

  return {
    reports,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get a single report by ID.
 * @param {string} userId
 * @param {string} projectId
 * @param {string} reportId
 * @returns {Object} Report document
 * @throws {AppError} 404 if not found or not owned
 */
const getReportById = async (userId, projectId, reportId) => {
  await verifyProjectOwnership(userId, projectId);

  const report = await Report.findOne({
    _id: reportId,
    project: projectId,
    user: userId,
  });

  if (!report) {
    throw new AppError('Report not found', 404);
  }

  return report;
};

/**
 * Delete a single report.
 *
 * Decrements the project's `reportCount`.
 * File cleanup (deleting the actual CSV from disk) is handled
 * by the controller — this service only manages database state.
 *
 * @param {string} userId
 * @param {string} projectId
 * @param {string} reportId
 * @returns {Object} Deleted report (contains filePath for cleanup)
 */
const deleteReport = async (userId, projectId, reportId) => {
  await verifyProjectOwnership(userId, projectId);

  const report = await Report.findOneAndDelete({
    _id: reportId,
    project: projectId,
    user: userId,
  });

  if (!report) {
    throw new AppError('Report not found', 404);
  }

  // Decrement denormalized counter.
  await Project.findByIdAndUpdate(projectId, { $inc: { reportCount: -1 } });

  return report;
};

/**
 * Delete all reports for a project.
 *
 * Called when a project is deleted.  Returns the deleted reports
 * so the controller can clean up files from disk.
 *
 * @param {string} userId
 * @param {string} projectId
 * @returns {Array} Deleted report documents
 */
const deleteReportsByProject = async (userId, projectId) => {
  const reports = await Report.find({ project: projectId, user: userId });
  await Report.deleteMany({ project: projectId, user: userId });
  return reports;
};

/**
 * Update report status and analytics.
 *
 * Called when FastAPI returns processed results.  Sets the status
 * to `completed` and stores the analytics JSON.
 *
 * @param {string} reportId
 * @param {string} status - New status
 * @param {Object} [analytics=null] - FastAPI results
 * @returns {Object} Updated report
 */
const updateReportStatus = async (reportId, status, analytics = null) => {
  const update = { status };

  if (analytics) {
    update.analytics = analytics;
  }

  if (status === 'completed') {
    update.processedAt = new Date();
  }

  const report = await Report.findByIdAndUpdate(reportId, update, { new: true });

  if (!report) {
    throw new AppError('Report not found', 404);
  }

  return report;
};

module.exports = {
  createReport,
  listReports,
  getReportById,
  deleteReport,
  deleteReportsByProject,
  updateReportStatus,
};
