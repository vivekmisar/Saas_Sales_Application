import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggle = () => setSidebarCollapsed((p) => !p);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggle} />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-[70px]' : 'lg:ml-[240px]'}`}>
        <Navbar onMenuClick={toggle} />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
