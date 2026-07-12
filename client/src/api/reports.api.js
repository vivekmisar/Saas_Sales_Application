import api from './axios';

export const reportsApi = {
  list: (projectId, params) =>
    api.get(`/projects/${projectId}/reports`, { params }),
  get: (projectId, reportId) =>
    api.get(`/projects/${projectId}/reports/${reportId}`),
  create: (projectId, data) =>
    api.post(`/projects/${projectId}/reports`, data),
  delete: (projectId, reportId) =>
    api.delete(`/projects/${projectId}/reports/${reportId}`),
};
