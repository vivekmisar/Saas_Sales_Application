import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject, useUpdateProject, useDeleteProject } from '../../hooks/useProjects';
import { useReports, useCreateReport, useDeleteReport } from '../../hooks/useReports';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { ArrowLeft, Upload, FileSpreadsheet, Trash2, Pencil, FileText } from 'lucide-react';
import { formatDate, formatFileSize, formatRelativeTime } from '../../utils/formatters';

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { data: project, isLoading: pLoading } = useProject(projectId);
  const { data: reportData, isLoading: rLoading } = useReports(projectId);
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const createReport = useCreateReport(projectId);
  const deleteReport = useDeleteReport(projectId);

  const [showEdit, setShowEdit] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [deleteReportTarget, setDeleteReportTarget] = useState(null);
  const [showDeleteProject, setShowDeleteProject] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [uploadForm, setUploadForm] = useState({ fileName: '', originalName: '', filePath: '', fileSize: 0, mimeType: 'text/csv' });

  const openEdit = () => {
    setEditForm({ name: project?.name || '', description: project?.description || '' });
    setShowEdit(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    await updateProject.mutateAsync({ id: projectId, data: editForm });
    setShowEdit(false);
  };

  const handleDeleteProject = async () => {
    await deleteProject.mutateAsync(projectId);
    navigate('/projects');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    await createReport.mutateAsync(uploadForm);
    setUploadForm({ fileName: '', originalName: '', filePath: '', fileSize: 0, mimeType: 'text/csv' });
    setShowUpload(false);
  };

  const handleDeleteReport = async () => {
    await deleteReport.mutateAsync(deleteReportTarget._id);
    setDeleteReportTarget(null);
  };

  if (pLoading) return <Spinner size={32} className="mt-32" />;
  if (!project) return <EmptyState title="Project not found" />;

  const reports = reportData?.reports || [];

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 mb-5 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to Projects
      </button>

      {/* Project header card */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0">
              <FileText size={24} className="text-indigo-500" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50" style={{ fontFamily: 'var(--font-heading)' }}>{project.name}</h1>
                <Badge status={project.status} />
              </div>
              {project.description && <p className="text-sm text-slate-500 dark:text-slate-400">{project.description}</p>}
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                Created {formatDate(project.createdAt)} · {project.reportCount} report{project.reportCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="secondary" size="sm" onClick={openEdit}><Pencil size={14} /> Edit</Button>
            <Button variant="danger" size="sm" onClick={() => setShowDeleteProject(true)}><Trash2 size={14} /> Delete</Button>
          </div>
        </div>
      </Card>

      {/* Reports */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'var(--font-heading)' }}>Reports</h2>
        <Button size="sm" onClick={() => setShowUpload(true)}><Upload size={14} /> Upload CSV</Button>
      </div>

      {rLoading ? (
        <Spinner size={24} className="mt-12" />
      ) : reports.length === 0 ? (
        <EmptyState icon={FileSpreadsheet} title="No reports yet" description="Upload a CSV file to start analyzing." actionLabel="Upload CSV" onAction={() => setShowUpload(true)} />
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <Card key={report._id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center shrink-0">
                  <FileSpreadsheet size={20} className="text-emerald-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{report.originalName}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="font-mono">{formatFileSize(report.fileSize)}</span>
                    <span>{formatRelativeTime(report.uploadedAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Badge status={report.status} />
                <button onClick={() => setDeleteReportTarget(report)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer">
                  <Trash2 size={14} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Project">
        <form onSubmit={handleEdit} className="space-y-4">
          <Input label="Project Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
          <Input label="Description" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowEdit(false)} type="button">Cancel</Button>
            <Button type="submit" loading={updateProject.isPending}>Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* Upload Modal */}
      <Modal isOpen={showUpload} onClose={() => setShowUpload(false)} title="Upload Report">
        <form onSubmit={handleUpload} className="space-y-4">
          <Input label="Original File Name" placeholder="sales_q3.csv" value={uploadForm.originalName} onChange={(e) => setUploadForm({ ...uploadForm, originalName: e.target.value })} required />
          <Input label="File Name (on disk)" placeholder="abc123.csv" value={uploadForm.fileName} onChange={(e) => setUploadForm({ ...uploadForm, fileName: e.target.value })} required />
          <Input label="File Path" placeholder="uploads/abc123.csv" value={uploadForm.filePath} onChange={(e) => setUploadForm({ ...uploadForm, filePath: e.target.value })} required />
          <Input label="File Size (bytes)" type="number" placeholder="2048" value={uploadForm.fileSize || ''} onChange={(e) => setUploadForm({ ...uploadForm, fileSize: Number(e.target.value) })} required />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowUpload(false)} type="button">Cancel</Button>
            <Button type="submit" loading={createReport.isPending}>Upload</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={showDeleteProject} onClose={() => setShowDeleteProject(false)} onConfirm={handleDeleteProject} title="Delete Project" message={`Permanently delete "${project.name}" and all its reports?`} loading={deleteProject.isPending} />
      <ConfirmDialog isOpen={!!deleteReportTarget} onClose={() => setDeleteReportTarget(null)} onConfirm={handleDeleteReport} title="Delete Report" message={`Delete "${deleteReportTarget?.originalName}"?`} loading={deleteReport.isPending} />
    </div>
  );
}
