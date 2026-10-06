import { MapPin, Tag, RefreshCw } from 'lucide-react';
import Card from '../ui/Card';
import FilterSelect from '../ui/FilterSelect';
import MonthPicker from '../ui/MonthPicker';

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
          
          {/* Month range */}
          <div className="app-month-range flex items-center gap-2">
            <MonthPicker value={filters.startMonth || ''} onChange={(startMonth) => onChange({ ...filters, startMonth })} label="Start date" />
            <span className="text-slate-400 text-sm">to</span>
            <MonthPicker value={filters.endMonth || ''} onChange={(endMonth) => onChange({ ...filters, endMonth })} label="End date" />
          </div>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          {/* Region */}
          <FilterSelect
            icon={MapPin}
            value={filters.region || ''}
            onChange={(region) => onChange({ ...filters, region })}
            options={regions}
            emptyLabel="All Regions"
            ariaLabel="Filter by region"
          />

          {/* Category */}
          <FilterSelect
            icon={Tag}
            value={filters.category || ''}
            onChange={(category) => onChange({ ...filters, category })}
            options={categories}
            emptyLabel="All Categories"
            ariaLabel="Filter by category"
          />

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
