import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
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
import FileUploadZone from '../../components/ui/FileUploadZone';
import {
  ArrowLeft,
  Upload,
  FileSpreadsheet,
  Trash2,
  Pencil,
  FileText,
} from 'lucide-react';
import { formatDate, formatFileSize, formatRelativeTime } from '../../utils/formatters';

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: reportData, isLoading: reportsLoading } = useReports(projectId);
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const createReport = useCreateReport(projectId);
  const deleteReport = useDeleteReport(projectId);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteProject, setShowDeleteProject] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current && reportData?.reports?.length) {
      gsap.fromTo(
        listRef.current.children,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out', clearProps: 'all' }
      );
    }
  }, [reportData?.reports]);

  const openEdit = () => {
    setEditForm({
      name: project?.name || '',
      description: project?.description || '',
    });
    setShowEditModal(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    await updateProject.mutateAsync({ id: projectId, data: editForm });
    setShowEditModal(false);
  };

  const handleDeleteProject = async () => {
    await deleteProject.mutateAsync(projectId);
    navigate('/projects');
  };

  const handleUploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    await createReport.mutateAsync(formData);
    setShowUploadModal(false);
  };

  const handleDeleteReport = async () => {
    await deleteReport.mutateAsync(deleteTarget._id);
    setDeleteTarget(null);
  };

  if (projectLoading) return <Spinner size={32} className="mt-32" />;
  if (!project) return <EmptyState title="Project not found" />;

  const reports = reportData?.reports || [];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary mb-4 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to Projects
      </button>

      {/* Project header */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center shrink-0">
              <FileText size={24} className="text-brand" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-heading font-bold text-text-primary">
                  {project.name}
                </h1>
                <Badge status={project.status} />
              </div>
              {project.description && (
                <p className="text-sm text-text-muted">{project.description}</p>
              )}
              <p className="text-xs text-text-muted mt-2">
                Created {formatDate(project.createdAt)} · {project.reportCount} report
                {project.reportCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={openEdit}>
              <Pencil size={14} /> Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteProject(true)}
            >
              <Trash2 size={14} /> Delete
            </Button>
          </div>
        </div>
      </Card>

      {/* Reports section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-text-primary">
          Reports
        </h2>
        <Button size="sm" onClick={() => setShowUploadModal(true)}>
          <Upload size={14} /> Upload CSV
        </Button>
      </div>

      {reportsLoading ? (
        <Spinner size={24} className="mt-12" />
      ) : reports.length === 0 ? (
        <EmptyState
          icon={FileSpreadsheet}
          title="No reports yet"
          description="Upload a CSV file to start analyzing your sales data."
          actionLabel="Upload CSV"
          onAction={() => setShowUploadModal(true)}
        />
      ) : (
        <div className="space-y-3" ref={listRef}>
          {reports.map((report) => (
            <Card
              key={report._id}
              className={`flex items-center justify-between ${report.status === 'completed' ? 'cursor-pointer' : ''}`}
              hover={report.status === 'completed'}
              onClick={
                report.status === 'completed'
                  ? () => navigate(`/projects/${projectId}/reports/${report._id}`)
                  : undefined
              }
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <FileSpreadsheet size={20} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {report.originalName}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
                    <span className="font-mono">{formatFileSize(report.fileSize)}</span>
                    <span>{formatRelativeTime(report.uploadedAt)}</span>
                    {report.status === 'completed' && (
                      <span className="text-indigo-500 font-medium">View Dashboard →</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge status={report.status} />
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteTarget(report); }}
                  className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Project Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Project"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          <Input
            label="Project Name"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            required
          />
          <Input
            label="Description"
            value={editForm.description}
            onChange={(e) =>
              setEditForm({ ...editForm, description: e.target.value })
            }
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowEditModal(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" loading={updateProject.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Report"
      >
        <FileUploadZone 
          onUpload={handleUploadFile}
          isUploading={createReport.isPending}
          onCancel={() => setShowUploadModal(false)}
        />
      </Modal>

      {/* Delete Project Confirm */}
      <ConfirmDialog
        isOpen={showDeleteProject}
        onClose={() => setShowDeleteProject(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message={`This will permanently delete "${project.name}" and all its reports.`}
        loading={deleteProject.isPending}
      />

      {/* Delete Report Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteReport}
        title="Delete Report"
        message={`Delete "${deleteTarget?.originalName}"? This cannot be undone.`}
        loading={deleteReport.isPending}
      />
    </div>
  );
}
