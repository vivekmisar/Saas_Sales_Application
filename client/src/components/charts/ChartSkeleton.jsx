import Card from '../ui/Card';

/**
 * ChartSkeleton — prevents layout shifts by mimicking the dimensions of charts while loading.
 */
export default function ChartSkeleton({ height = 300, className = '' }) {
  return (
    <Card className={`app-chart-skeleton ${className}`}>
      <div className="mb-4 space-y-2">
        {/* Title skeleton */}
        <div className="app-skeleton-line h-4 w-1/3"></div>
        {/* Subtitle skeleton */}
        <div className="app-skeleton-line h-3 w-1/4 mt-1"></div>
      </div>
      {/* Chart body skeleton */}
      <div className="app-skeleton-block" style={{ height }} />
    </Card>
  );
}

export function KpiSkeleton() {
  return (
    <div className="app-kpi-strip app-kpi-skeleton">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="app-kpi-card"
        >
          <div className="app-kpi-card-inner">
            <div className="app-skeleton-line h-3 w-2/3" />
            <div className="app-skeleton-line h-7 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <Card className="app-table-skeleton">
      <div className="mb-5 space-y-2">
        <div className="app-skeleton-line h-4 w-1/4" />
        <div className="app-skeleton-line h-3 w-1/3" />
      </div>
      <div className="app-skeleton-line app-skeleton-table-head h-9 w-full" />
      {[0, 1, 2, 3].map((row) => <div className="app-skeleton-line app-skeleton-table-row h-12 w-full" key={row} />)}
    </Card>
  );
}
