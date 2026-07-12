import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects, useCreateProject, useDeleteProject } from '../../hooks/useProjects';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { Plus, FolderKanban, FileText, Trash2, Search } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';
import gsap from 'gsap';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();
  const gridRef = useRef(null);

  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [createForm, setCreateForm] = useState({ name: '', description: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (gridRef.current && data?.projects?.length) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out' },
      );
    }
  }, [data]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createProject.mutateAsync(createForm);
    setCreateForm({ name: '', description: '' });
    setShowCreate(false);
  };

  const handleDelete = async () => {
    await deleteProject.mutateAsync(deleteTarget._id);
    setDeleteTarget(null);
  };

  const filtered = data?.projects?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  ) || [];

  if (isLoading) return <Spinner size={32} className="mt-32" />;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50" style={{ fontFamily: 'var(--font-heading)' }}>
            Projects
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {data?.total || 0} project{data?.total !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus size={16} /> New Project
        </Button>
      </div>

      {data?.total > 0 && (
        <div className="mb-6 max-w-sm">
          <Input placeholder="Search projects…" icon={Search} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      )}

      {filtered.length === 0 && !search ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to start uploading sales data and generating analytics."
          actionLabel="Create Project"
          onAction={() => setShowCreate(true)}
        />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Search} title="No results" description={`No projects matching "${search}"`} />
      ) : (
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <Card key={project._id} hover onClick={() => navigate(`/projects/${project._id}`)}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0">
                  <FolderKanban size={20} className="text-indigo-500" />
                </div>
                <Badge status={project.status} />
              </div>

              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1 line-clamp-1" style={{ fontFamily: 'var(--font-heading)' }}>
                {project.name}
              </h3>
              {project.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{project.description}</p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <FileText size={13} />
                  <span>{project.reportCount} report{project.reportCount !== 1 ? 's' : ''}</span>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500">{formatRelativeTime(project.createdAt)}</span>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); setDeleteTarget(project); }}
                className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-all cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Project Name" placeholder="e.g. Q3 Sales Analysis" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} required />
          <Input label="Description (optional)" placeholder="Brief description" value={createForm.description} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowCreate(false)} type="button">Cancel</Button>
            <Button type="submit" loading={createProject.isPending}>Create</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Permanently delete "${deleteTarget?.name}" and all its reports?`}
        loading={deleteProject.isPending}
      />
    </div>
  );
}
