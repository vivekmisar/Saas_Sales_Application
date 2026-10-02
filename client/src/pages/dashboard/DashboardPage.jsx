import { useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProjects } from '../../hooks/useProjects';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { FolderKanban, FileText, TrendingUp, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import useReducedMotion from '../../hooks/useReducedMotion';
import { formatInteger } from '../../lib/formatters';

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
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (cardsRef.current && !isLoading && !reducedMotion) {
      const tween = gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out' },
      );
      return () => tween.kill();
    }
  }, [isLoading, reducedMotion]);

  const firstName = user?.name?.split(' ')[0] || 'there';
  const projectCount = data?.total ?? 0;
  const totalReports =
    data?.projects?.reduce((s, p) => s + (p.reportCount || 0), 0) ?? 0;

  const stats = [
    {
      label: 'Total Projects',
      value: projectCount,
      icon: FolderKanban,
    },
    {
      label: 'Total Reports',
      value: totalReports,
      icon: FileText,
    },
    {
      label: 'Analytics Ready',
      value: 'Coming Soon',
      icon: TrendingUp,
    },
  ];

  const quickActions = [
    {
      to: '/projects',
      icon: FolderKanban,
      label: 'View Projects',
      sub: 'Manage your analytics projects',
    },
    {
      to: '/projects',
      icon: FileText,
      label: 'Upload Data',
      sub: 'Add a CSV to start analyzing',
    },
  ];

  if (isLoading) return <Spinner size={32} className="mt-32" />;

  return (
    <div className="app-dashboard-page w-full max-w-6xl">
      {/* Page heading */}
      <div className="app-page-heading mb-8">
        <h1
          className="app-page-title text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-50"
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
        className="app-stat-grid grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      >
        {stats.map(({ label, value, icon: Icon }) => (
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
                  {typeof value === 'number' ? formatInteger(value) : value}
                </p>
              </div>
              <div className="app-stat-icon p-2.5 rounded-xl shrink-0">
                <Icon size={22} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <Card>
        <h2
          className="app-section-title text-base font-semibold text-slate-800 dark:text-slate-100 mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quickActions.map(({ to, icon: Icon, label, sub }) => (
            <Link
              key={label}
              to={to}
              className="app-quick-action flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon size={20} className="app-accent-icon shrink-0" />
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
