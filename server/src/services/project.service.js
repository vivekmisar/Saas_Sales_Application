const Project = require('../models/project.model');
const AppError = require('../utils/AppError');

/**
 * Project service — business logic layer.
 *
 * Every method takes `userId` as its first argument to enforce
 * ownership at the service level.  This means even if a controller
 * is misconfigured, a user can never access another user's projects.
 *
 * Why ownership checks here instead of in middleware?
 * Middleware would need to fetch the project, check ownership, then
 * the controller would fetch it again to use it.  Doing it in the
 * service avoids the double-fetch and keeps authorization co-located
 * with the business logic it protects.
 */

/**
 * Create a new project.
 * @param {string} userId - Owner's ID
 * @param {Object} data - { name, description? }
 * @returns {Object} Created project
 * @throws {AppError} 409 if project name already exists for this user
 */
const createProject = async (userId, { name, description }) => {
  // The compound unique index (user + name) will throw a Mongoose
  // duplicate key error if violated.  We catch it proactively for
  // a cleaner error message.
  const existing = await Project.findOne({ user: userId, name });
  if (existing) {
    throw new AppError('You already have a project with this name', 409);
  }

  const project = await Project.create({
    name,
    description,
    user: userId,
  });

  return project;
};

/**
 * List all projects for a user.
 *
 * Supports filtering by status and pagination.
 * Defaults to active projects, sorted newest first.
 *
 * @param {string} userId
 * @param {Object} options - { status?, page?, limit? }
 * @returns {Object} { projects, total, page, totalPages }
 */
const listProjects = async (userId, { status, page = 1, limit = 10 } = {}) => {
  const filter = { user: userId };

  // Only add status filter if explicitly provided.
  // This allows listing ALL projects (active + archived) by omitting status.
  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [projects, total] = await Promise.all([
    Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Project.countDocuments(filter),
  ]);

  return {
    projects,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get a single project by ID.
 * @param {string} userId - For ownership check
 * @param {string} projectId
 * @returns {Object} Project document
 * @throws {AppError} 404 if not found or not owned
 */
const getProjectById = async (userId, projectId) => {
  const project = await Project.findOne({ _id: projectId, user: userId });
  if (!project) {
    throw new AppError('Project not found', 404);
  }
  return project;
};

/**
 * Update a project.
 *
 * Only allows updating `name`, `description`, and `status`.
 * The `user` and `reportCount` fields are never client-editable.
 *
 * @param {string} userId
 * @param {string} projectId
 * @param {Object} updates - { name?, description?, status? }
 * @returns {Object} Updated project
 * @throws {AppError} 404 if not found or not owned
 * @throws {AppError} 409 if new name conflicts with existing project
 */
const updateProject = async (userId, projectId, updates) => {
  const project = await Project.findOne({ _id: projectId, user: userId });
  if (!project) {
    throw new AppError('Project not found', 404);
  }

  // Check for name conflict if the name is being changed.
  if (updates.name && updates.name !== project.name) {
    const conflict = await Project.findOne({ user: userId, name: updates.name });
    if (conflict) {
      throw new AppError('You already have a project with this name', 409);
    }
  }

  // Apply only allowed fields.
  const allowedFields = ['name', 'description', 'status'];
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      project[field] = updates[field];
    }
  }

  await project.save({ validateModifiedOnly: true });
  return project;
};

/**
 * Delete a project.
 *
 * Hard-deletes the project document.  The report service is
 * responsible for cleaning up associated reports and files —
 * that logic will be triggered from the controller to keep
 * this service focused on projects only.
 *
 * @param {string} userId
 * @param {string} projectId
 * @returns {Object} Deleted project (for confirmation)
 * @throws {AppError} 404 if not found or not owned
 */
const deleteProject = async (userId, projectId) => {
  const project = await Project.findOneAndDelete({ _id: projectId, user: userId });
  if (!project) {
    throw new AppError('Project not found', 404);
  }
  return project;
};

module.exports = {
  createProject,
  listProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
