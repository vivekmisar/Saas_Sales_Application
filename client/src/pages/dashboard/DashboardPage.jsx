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
    if (cardsRef.current && !isLoading) {
      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
      );
    }
  }, [isLoading]);

  const firstName = user?.name?.split(' ')[0] || 'there';
  const projectCount = data?.total ?? 0;
  const totalReports =
    data?.projects?.reduce((s, p) => s + (p.reportCount || 0), 0) ?? 0;

  const stats = [
    {
      label: 'Total Projects',
      value: projectCount,
      icon: FolderKanban,
      bg: 'bg-indigo-50 dark:bg-indigo-950',
      iconCls: 'text-indigo-500',
    },
    {
      label: 'Total Reports',
      value: totalReports,
      icon: FileText,
      bg: 'bg-violet-50 dark:bg-violet-950',
      iconCls: 'text-violet-500',
    },
    {
      label: 'Analytics Ready',
      value: 'Coming Soon',
      icon: TrendingUp,
      bg: 'bg-emerald-50 dark:bg-emerald-950',
      iconCls: 'text-emerald-500',
    },
  ];

  const quickActions = [
    {
      to: '/projects',
      icon: FolderKanban,
      color: 'text-indigo-500',
      label: 'View Projects',
      sub: 'Manage your analytics projects',
    },
    {
      to: '/projects',
      icon: FileText,
      color: 'text-violet-500',
      label: 'Upload Data',
      sub: 'Add a CSV to start analyzing',
    },
  ];

  if (isLoading) return <Spinner size={32} className="mt-32" />;

  return (
    <div className="w-full max-w-5xl">
      {/* Page heading */}
      <div className="mb-8">
        <h1
          className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-50"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Good {getGreeting()}, {firstName} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Here's your sales intelligence overview.
        </p>
      </div>

      {/* Stat cards */}
      <div
        ref={cardsRef}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      >
        {stats.map(({ label, value, icon: Icon, bg, iconCls }) => (
          <Card key={label}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  {label}
                </p>
                <p
                  className="text-2xl font-bold text-slate-900 dark:text-slate-50"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {value}
                </p>
              </div>
              <div className={`${bg} p-2.5 rounded-xl shrink-0`}>
                <Icon size={22} className={iconCls} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <Card>
        <h2
          className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map(({ to, icon: Icon, color, label, sub }) => (
            <Link
              key={label}
              to={to}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon size={20} className={`${color} shrink-0`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                    {label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {sub}
                  </p>
                </div>
              </div>
              <ArrowRight
                size={16}
                className="text-slate-400 shrink-0 group-hover:translate-x-1 transition-transform ml-2"
              />
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
