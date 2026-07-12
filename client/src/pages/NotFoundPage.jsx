import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
      <div className="text-center max-w-md">
        <p className="text-8xl font-bold bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          404
        </p>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Page not found
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard">
          <Button><Home size={16} /> Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
