import Card from '../ui/Card';

/**
 * ChartSkeleton — prevents layout shifts by mimicking the dimensions of charts while loading.
 */
export default function ChartSkeleton({ height = 300, className = '' }) {
  return (
    <Card className={`animate-pulse ${className}`}>
      <div className="mb-4 space-y-2">
        {/* Title skeleton */}
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
        {/* Subtitle skeleton */}
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/4 mt-1"></div>
      </div>
      {/* Chart body skeleton */}
      <div 
        className="bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800"
        style={{ height }}
      ></div>
    </Card>
  );
}

export function KpiSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 animate-pulse"
        >
          <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 mb-3"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );
}
