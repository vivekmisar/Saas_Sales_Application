const projectService = require('../services/project.service');
const reportService = require('../services/report.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

/**
 * Project controller — thin HTTP layer.
 *
 * All handlers:
 *  1. Extract user ID from `req.user.id` (set by Passport).
 *  2. Delegate to the project service.
 *  3. Send a standardised response via ApiResponse.
 *
 * Ownership is enforced in the service layer, not here.
 */

/**
 * POST /api/v1/projects
 * Body: { name, description? }
 */
const createProject = catchAsync(async (req, res) => {
  const project = await projectService.createProject(req.user.id, req.body);
  return ApiResponse.success(res, 201, 'Project created successfully', { project });
});

/**
 * GET /api/v1/projects
 * Query: ?status=active&page=1&limit=10
 */
const listProjects = catchAsync(async (req, res) => {
  const { status, page, limit } = req.query;
  const result = await projectService.listProjects(req.user.id, {
    status,
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
  });
  return ApiResponse.success(res, 200, 'Projects fetched successfully', result);
});

/**
 * GET /api/v1/projects/:projectId
 */
const getProject = catchAsync(async (req, res) => {
  const project = await projectService.getProjectById(req.user.id, req.params.projectId);
  return ApiResponse.success(res, 200, 'Project fetched successfully', { project });
});

/**
 * PATCH /api/v1/projects/:projectId
 * Body: { name?, description?, status? }
 */
const updateProject = catchAsync(async (req, res) => {
  const project = await projectService.updateProject(
    req.user.id,
    req.params.projectId,
    req.body,
  );
  return ApiResponse.success(res, 200, 'Project updated successfully', { project });
});

/**
 * DELETE /api/v1/projects/:projectId
 *
 * Deletes the project AND all its associated reports.
 * Report cleanup (both DB and files) is coordinated here
 * because the controller is the right place to orchestrate
 * cross-service operations.
 */
const deleteProject = catchAsync(async (req, res) => {
  const { projectId } = req.params;

  // Delete all reports belonging to this project first.
  await reportService.deleteReportsByProject(req.user.id, projectId);

  // Then delete the project itself.
  await projectService.deleteProject(req.user.id, projectId);

  return ApiResponse.success(res, 200, 'Project and all reports deleted successfully');
});

module.exports = { createProject, listProjects, getProject, updateProject, deleteProject };
