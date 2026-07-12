import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../api/projects.api';
import toast from 'react-hot-toast';

export function useProjects(params) {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => projectsApi.list(params),
    select: (res) => res.data,
  });
}

export function useProject(id) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.get(id),
    select: (res) => res.data.project,
    enabled: !!id,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => projectsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create project');
    },
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => projectsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      qc.invalidateQueries({ queryKey: ['project'] });
      toast.success('Project updated');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update project');
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => projectsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete project');
    },
  });
}
