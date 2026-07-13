import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggle = () => setSidebarCollapsed((p) => !p);

  const sidebarWidth = sidebarCollapsed ? 70 : 240;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggle} />

      {/* Content area — offset by sidebar width, clips horizontal overflow */}
      <div
        className="flex flex-col min-h-screen overflow-x-hidden transition-all duration-300"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <Navbar />
        <main className="flex-1 px-6 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
