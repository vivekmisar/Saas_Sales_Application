import { Calendar, ChevronDown, MapPin, Tag, RefreshCw } from 'lucide-react';
import Card from '../ui/Card';

const monthLabel = (value, placeholder) => {
  if (!value) return placeholder;
  const date = new Date(`${value}-01T00:00:00`);
  return Number.isNaN(date.getTime()) ? placeholder : new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
};

export default function GlobalFilterBar({ analytics, filters, onChange, onReset }) {
  if (!analytics) return null;

  // Extract unique options from pre-aggregated analytics data
  const regions = [...new Set((Array.isArray(analytics.region_revenue) ? analytics.region_revenue : []).filter(Boolean).map(r => r.region).filter(Boolean))].sort();
  const categories = [...new Set((Array.isArray(analytics.category_revenue) ? analytics.category_revenue : []).filter(Boolean).map(c => c.category).filter(Boolean))].sort();

  return (
    <Card className="app-filter-bar p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-4 flex-1">
          
          {/* Date Range Placeholder (Since we don't have a complex datepicker library installed, 
              we'll use native month inputs matching the "YYYY-MM" format in monthly_revenue) */}
          <div className="app-month-range flex items-center gap-2">
            <div className="app-month-field relative">
              <Calendar className="app-month-icon" size={14} aria-hidden="true" />
              <input
                type="month"
                value={filters.startMonth || ''}
                onChange={(e) => onChange({ ...filters, startMonth: e.target.value })}
                aria-label="Start date"
                title="Start date"
                className="app-filter-control app-month-native"
              />
              <span className="app-month-value" aria-hidden="true">{monthLabel(filters.startMonth, 'Start date')}</span>
            </div>
            <span className="text-slate-400 text-sm">to</span>
            <div className="app-month-field relative">
              <Calendar className="app-month-icon" size={14} aria-hidden="true" />
              <input
                type="month"
                value={filters.endMonth || ''}
                onChange={(e) => onChange({ ...filters, endMonth: e.target.value })}
                aria-label="End date"
                title="End date"
                className="app-filter-control app-month-native"
              />
              <span className="app-month-value" aria-hidden="true">{monthLabel(filters.endMonth, 'End date')}</span>
            </div>
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
              className="app-filter-control pl-8 pr-8 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 appearance-none cursor-pointer"
            >
              <option value="">All Regions</option>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <ChevronDown className="app-select-chevron" size={14} aria-hidden="true" />
          </div>

          {/* Category */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <Tag size={14} className="text-slate-400" />
            </div>
            <select
              value={filters.category || ''}
              onChange={(e) => onChange({ ...filters, category: e.target.value })}
              className="app-filter-control pl-8 pr-8 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="app-select-chevron" size={14} aria-hidden="true" />
          </div>

        </div>

        {/* Actions */}
        <div>
          <button
            type="button"
            onClick={onReset}
            className="app-reset-filters flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw size={14} /> Reset Filters
          </button>
        </div>

      </div>
    </Card>
  );
}
