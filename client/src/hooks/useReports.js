import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi } from '../api/reports.api';
import toast from 'react-hot-toast';

export function useReports(projectId, params) {
  return useQuery({
    queryKey: ['reports', projectId, params],
    queryFn: () => reportsApi.list(projectId, params),
    select: (res) => res.data,
    enabled: !!projectId,
  });
}

export function useReport(projectId, reportId) {
  return useQuery({
    queryKey: ['report', projectId, reportId],
    queryFn: () => reportsApi.get(projectId, reportId),
    select: (res) => res.data.report,
    enabled: !!projectId && !!reportId,
  });
}

export function useCreateReport(projectId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => reportsApi.create(projectId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reports', projectId] });
      qc.invalidateQueries({ queryKey: ['project', projectId] });
      toast.success('Report uploaded');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to upload report');
    },
  });
}

export function useDeleteReport(projectId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reportId) => reportsApi.delete(projectId, reportId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reports', projectId] });
      qc.invalidateQueries({ queryKey: ['project', projectId] });
      toast.success('Report deleted');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete report');
    },
  });
}
