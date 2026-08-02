import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useParams, useNavigate } from 'react-router-dom';
import { useReport, useReports } from '../../hooks/useReports';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import GlobalFilterBar from '../../components/dashboard/GlobalFilterBar';
import GlobalSearch from '../../components/dashboard/GlobalSearch';
import ExportMenu from '../../components/dashboard/ExportMenu';
import ChartSkeleton, { KpiSkeleton } from '../../components/charts/ChartSkeleton';
import KpiCards from '../../components/charts/KpiCards';
import RevenueTrendChart from '../../components/charts/RevenueTrendChart';
import TopProductsChart from '../../components/charts/TopProductsChart';
import CategoryDistributionChart from '../../components/charts/CategoryDistributionChart';
import ProfitTrendChart from '../../components/charts/ProfitTrendChart';
import RegionalSalesChart from '../../components/charts/RegionalSalesChart';
import DataTable from '../../components/charts/DataTable';
import ProfitAnalytics from '../../components/charts/ProfitAnalytics';
import DiscountAnalytics from '../../components/charts/DiscountAnalytics';
import {
  ArrowLeft,
  FileSpreadsheet,
  Clock,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { formatDate, formatFileSize } from '../../utils/formatters';

/**
 * ReportDashboardPage — full analytics dashboard for a single report.
 *
 * Route: /projects/:projectId/reports/:reportId
 *
 * Fetches the report from MongoDB (which includes the analytics JSON
 * stored by the Express→FastAPI pipeline). All charts render from
 * this stored data — no additional API calls to FastAPI.
 */
export default function ReportDashboardPage() {
  const { projectId, reportId } = useParams();
  const navigate = useNavigate();
  
  // ── Hook Declarations (Must be above early returns) ───────────────
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [compareReportId, setCompareReportId] = useState('');
  const dashboardRef = useRef(null);

  const { data: report, isLoading } = useReport(projectId, reportId);
  const { data: reportsData } = useReports(projectId);
  const { data: compareReport } = useReport(projectId, compareReportId || null);

  const a = useMemo(() => {
    if (!report?.analytics) return null;
    const base = report.analytics;
    const q = searchQuery.toLowerCase();

    let mRev = base.monthly_revenue || [];
    if (filters.startMonth) mRev = mRev.filter(d => d.month >= filters.startMonth);
    if (filters.endMonth) mRev = mRev.filter(d => d.month <= filters.endMonth);

    let rRev = base.region_revenue || [];
    if (filters.region) rRev = rRev.filter(d => d.region === filters.region);
    
    let cRev = base.category_revenue || [];
    if (filters.category) cRev = cRev.filter(d => d.category === filters.category);

    let pRev = base.top_products || [];
    if (q) {
      pRev = pRev.filter(d => d.product.toLowerCase().includes(q));
      rRev = rRev.filter(d => d.region.toLowerCase().includes(q));
      cRev = cRev.filter(d => d.category.toLowerCase().includes(q));
    }

    const dynamicRevenue = mRev.reduce((sum, d) => sum + d.revenue, 0);

    return {
      ...base,
      total_revenue: filters.startMonth || filters.endMonth ? dynamicRevenue : base.total_revenue,
      monthly_revenue: mRev,
      region_revenue: rRev,
      category_revenue: cRev,
      top_products: pRev,
    };
  }, [report, filters, searchQuery]);

  useEffect(() => {
    if (report?.status === 'completed' && dashboardRef.current) {
      gsap.fromTo(
        dashboardRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [report?.status]);

  const handleProductDrillDown = useCallback((productName) => setSearchQuery(productName), []);
  const handleCategoryDrillDown = useCallback((categoryName) => setFilters(prev => ({ ...prev, category: categoryName })), []);
  const handleRegionDrillDown = useCallback((regionName) => setFilters(prev => ({ ...prev, region: regionName })), []);

  // ── Loading state ─────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-6 animate-pulse">
          <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
        <div className="h-24 w-full bg-slate-200 dark:bg-slate-700 rounded-xl mb-6"></div>
        <KpiSkeleton />
        <ChartSkeleton height={320} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton height={300} />
          <ChartSkeleton height={300} />
        </div>
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────
  if (!report) {
    return <EmptyState title="Report not found" />;
  }

  // ── Processing / Pending / Failed states ──────────────────────────
  if (report.status !== 'completed') {
    const statusInfo = {
      pending: {
        icon: Clock,
        title: 'Report is queued',
        desc: 'This report is waiting to be processed. It will be analyzed automatically.',
        color: 'text-amber-500',
      },
      processing: {
        icon: Loader2,
        title: 'Processing analytics…',
        desc: 'The analytics engine is crunching your data. This usually takes a few seconds.',
        color: 'text-blue-500',
        animate: true,
      },
      failed: {
        icon: AlertTriangle,
        title: 'Analysis failed',
        desc: 'Something went wrong while processing this CSV. Try re-uploading the file.',
        color: 'text-red-500',
      },
    };

    const info = statusInfo[report.status] || statusInfo.pending;
    const Icon = info.icon;

    return (
      <div className="max-w-lg mx-auto mt-20 text-center">
        <Icon
          size={48}
          className={`mx-auto mb-4 ${info.color} ${info.animate ? 'animate-spin' : ''}`}
        />
        <h2 className="text-lg font-heading font-semibold text-slate-800 dark:text-slate-200">
          {info.title}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{info.desc}</p>
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="mt-6 text-sm text-indigo-500 hover:text-indigo-400 transition-colors cursor-pointer"
        >
          ← Back to project
        </button>
      </div>
    );
  }

  // ── Completed — render the full dashboard ─────────────────────────
  const productTableCols = [
    { key: 'product', label: 'Product' },
    {
      key: 'revenue',
      label: 'Revenue',
      format: (v) => `$${Number(v).toLocaleString()}`,
    },
    { key: 'orders', label: 'Orders' },
  ];

  const regionTableCols = [
    { key: 'region', label: 'Region' },
    {
      key: 'revenue',
      label: 'Revenue',
      format: (v) => `$${Number(v).toLocaleString()}`,
    },
  ];

  const categoryTableCols = [
    { key: 'category', label: 'Category' },
    {
      key: 'revenue',
      label: 'Revenue',
      format: (v) => `$${Number(v).toLocaleString()}`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto" id="dashboard-content" ref={dashboardRef}>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => navigate(`/projects/${projectId}`)}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
          <div className="flex items-center gap-2">
            <FileSpreadsheet size={18} className="text-emerald-500" />
            <h1 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
              {report.originalName}
            </h1>
          </div>
          <Badge status={report.status} />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">
            {formatFileSize(report.fileSize)} · Uploaded {formatDate(report.uploadedAt)}
            {report.processedAt && ` · Processed ${formatDate(report.processedAt)}`}
          </div>
          <ExportMenu analytics={a} />
        </div>
      </div>

      {/* ── Global Search & Filters ────────────────────────────────── */}
      <div className="flex flex-col xl:flex-row gap-4 mb-6">
        <GlobalSearch value={searchQuery} onChange={setSearchQuery} />
        
        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          <GlobalFilterBar
            analytics={report.analytics}
            filters={filters}
            onChange={setFilters}
            onReset={() => {
              setFilters({});
              setSearchQuery('');
              setCompareReportId('');
            }}
          />
          
          {/* Comparison Dropdown */}
          {reportsData?.reports && reportsData.reports.length > 1 && (
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-10 mt-6 sm:mt-0">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Compare:</span>
              <select
                value={compareReportId}
                onChange={(e) => setCompareReportId(e.target.value)}
                className="text-sm bg-transparent border-none text-slate-900 dark:text-white focus:outline-none focus:ring-0 cursor-pointer"
              >
                <option value="">None</option>
                {reportsData.reports
                  .filter(r => r._id !== reportId && r.status === 'completed')
                  .map(r => (
                    <option key={r._id} value={r._id}>
                      {r.originalName || formatDate(r.createdAt)}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────── */}
      <div className="mb-6">
        <KpiCards analytics={a} compareAnalytics={compareReport?.analytics} />
      </div>

      {/* ── Revenue Trend (full width) ─────────────────────────────── */}
      <div className="mb-6">
        <RevenueTrendChart data={a.monthly_revenue} />
      </div>

      {/* ── Top Products + Category Distribution (2-col) ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <TopProductsChart 
            data={a.top_products} 
            onDrillDown={handleProductDrillDown}
          />
        </div>
        <div>
          <CategoryDistributionChart 
            data={a.category_revenue} 
            onDrillDown={handleCategoryDrillDown}
          />
        </div>
      </div>

      {/* ── Revenue by Month (full width) ──────────────────────────── */}
      <div className="mb-6">
        <ProfitTrendChart data={a.monthly_revenue} totalProfit={a.total_profit} />
      </div>

      {/* ── Regional Sales (full width) ────────────────────────────── */}
      <div className="mb-6">
        <RegionalSalesChart 
          data={a.region_revenue}
          onDrillDown={handleRegionDrillDown}
        />
      </div>

      {/* ── Data Tables ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <DataTable
            title="Products Table"
            subtitle="Sortable product breakdown"
            columns={productTableCols}
            data={a.top_products}
          />
        </div>
        <div>
          <DataTable
            title="Regions Table"
            subtitle="Revenue by region"
            columns={regionTableCols}
            data={a.region_revenue}
          />
        </div>
      </div>

      <div className="mb-6">
        <DataTable
          title="Categories Table"
          subtitle="Revenue by category"
          columns={categoryTableCols}
          data={a.category_revenue}
        />
      </div>

      {/* ── Extrapolated Analytics Sections ────────────────────────── */}
      <ProfitAnalytics 
        analytics={a} 
        onDrillDown={(type, name) => {
          if (type === 'category') setFilters(prev => ({ ...prev, category: name }));
          if (type === 'product') setSearchQuery(name);
        }}
      />
      <DiscountAnalytics analytics={a} />
    </div>
  );
}
