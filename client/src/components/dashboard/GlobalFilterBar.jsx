import { Calendar, MapPin, Tag, RefreshCw } from 'lucide-react';
import Card from '../ui/Card';

export default function GlobalFilterBar({ analytics, filters, onChange, onReset }) {
  if (!analytics) return null;

  // Extract unique options from pre-aggregated analytics data
  const regions = [...new Set(analytics.region_revenue.map(r => r.region))].sort();
  const categories = [...new Set(analytics.category_revenue.map(c => c.category))].sort();

  return (
    <Card className="app-filter-bar p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-4 flex-1">
          
          {/* Date Range Placeholder (Since we don't have a complex datepicker library installed, 
              we'll use native month inputs matching the "YYYY-MM" format in monthly_revenue) */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Calendar size={14} className="text-slate-400" />
              </div>
              <input
                type="month"
                value={filters.startMonth || ''}
                onChange={(e) => onChange({ ...filters, startMonth: e.target.value })}
                className="pl-8 pr-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <span className="text-slate-400 text-sm">to</span>
            <input
              type="month"
              value={filters.endMonth || ''}
              onChange={(e) => onChange({ ...filters, endMonth: e.target.value })}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          {/* Region */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <MapPin size={14} className="text-slate-400" />
            </div>
            <select
              value={filters.region || ''}
              onChange={(e) => onChange({ ...filters, region: e.target.value })}
              className="pl-8 pr-8 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
            >
              <option value="">All Regions</option>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Category */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <Tag size={14} className="text-slate-400" />
            </div>
            <select
              value={filters.category || ''}
              onChange={(e) => onChange({ ...filters, category: e.target.value })}
              className="pl-8 pr-8 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

        </div>

        {/* Actions */}
        <div>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw size={14} /> Reset Filters
          </button>
        </div>

      </div>
    </Card>
  );
}
