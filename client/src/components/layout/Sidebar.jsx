import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/projects', label: 'Projects', icon: FolderKanban },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <>
      {!collapsed && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onToggle} />
      )}

      <aside
        data-collapsed={collapsed}
        className={`
          app-sidebar fixed top-0 left-0 z-40 h-screen
          bg-slate-950 flex flex-col transition-all duration-300
          border-r border-white/5
          ${collapsed ? 'w-[70px]' : 'w-[240px]'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
          <div className="app-logo-mark w-8 h-8 shrink-0">
            <Zap size={18} />
          </div>
          {!collapsed && (
            <span className="app-brand-name text-base whitespace-nowrap">
              SalesIntel
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive ? 'active' : ''}
                ${collapsed ? 'justify-center' : ''}`
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="app-sidebar-toggle flex items-center justify-center h-12 border-t transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </aside>
    </>
  );
}
