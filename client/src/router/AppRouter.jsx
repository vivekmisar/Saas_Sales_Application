import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import ErrorBoundary from '../components/ErrorBoundary';
import Spinner from '../components/ui/Spinner';

/**
 * Route-level code splitting with React.lazy.
 *
 * Each page is loaded on demand — the initial bundle only includes
 * the router shell, layout, and auth provider.  This splits the
 * ~2.5 MB monolith into smaller chunks that load as the user
 * navigates.  The heaviest chunk (ReportDashboardPage with ECharts)
 * is only fetched when the user actually opens a report.
 */

// ── Public pages ────────────────────────────────────────────────
const LandingPage = lazy(() => import('../pages/landing/LandingPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// ── Protected pages ─────────────────────────────────────────────
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const ProjectsPage = lazy(() => import('../pages/projects/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('../pages/projects/ProjectDetailPage'));
const ReportDashboardPage = lazy(() => import('../pages/reports/ReportDashboardPage'));

/**
 * Loading fallback shown while lazy chunks are being fetched.
 */
function PageLoader() {
  return <Spinner size={32} className="mt-32" />;
}

export default function AppRouter() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes with dashboard layout */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
              <Route path="/projects/:projectId/reports/:reportId" element={<ReportDashboardPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
