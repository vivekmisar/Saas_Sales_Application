import { useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProjects } from '../../hooks/useProjects';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { FolderKanban, FileText, TrendingUp, ArrowRight } from 'lucide-react';
import gsap from 'gsap';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useProjects();
  const cardsRef = useRef(null);

  useEffect(() => {
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
      );
    }
  }, [isLoading]);

  const firstName = user?.name?.split(' ')[0] || 'there';
  const projectCount = data?.total || 0;
  const totalReports = data?.projects?.reduce((s, p) => s + (p.reportCount || 0), 0) || 0;

  const stats = [
    { label: 'Total Projects', value: projectCount, icon: FolderKanban, bg: 'bg-indigo-50 dark:bg-indigo-950', icon_cls: 'text-indigo-500' },
    { label: 'Total Reports',  value: totalReports,  icon: FileText,     bg: 'bg-violet-50 dark:bg-violet-950', icon_cls: 'text-violet-500' },
    { label: 'Analytics Ready', value: 'Soon',        icon: TrendingUp,   bg: 'bg-emerald-50 dark:bg-emerald-950', icon_cls: 'text-emerald-500' },
  ];

  if (isLoading) return <Spinner size={32} className="mt-32" />;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-50" style={{ fontFamily: 'var(--font-heading)' }}>
          Good {getGreeting()}, {firstName} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your sales intelligence overview.</p>
      </div>

      <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, bg, icon_cls }) => (
          <Card key={label}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-50" style={{ fontFamily: 'var(--font-heading)' }}>{value}</p>
              </div>
              <div className={`${bg} p-2.5 rounded-xl`}>
                <Icon size={22} className={icon_cls} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { to: '/projects', icon: FolderKanban, color: 'text-indigo-500', hoverBorder: 'hover:border-indigo-300 dark:hover:border-indigo-700', hoverBg: 'hover:bg-indigo-50 dark:hover:bg-indigo-950/50', label: 'View Projects', sub: 'Manage your analytics projects' },
            { to: '/projects', icon: FileText,      color: 'text-violet-500', hoverBorder: 'hover:border-violet-300 dark:hover:border-violet-700', hoverBg: 'hover:bg-violet-50 dark:hover:bg-violet-950/50', label: 'Upload Data',   sub: 'Add a CSV to start analyzing' },
          ].map(({ to, icon: Icon, color, hoverBorder, hoverBg, label, sub }) => (
            <Link key={label} to={to} className={`flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 ${hoverBorder} ${hoverBg} transition-all duration-200 group`}>
              <div className="flex items-center gap-3">
                <Icon size={20} className={color} />
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{sub}</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
