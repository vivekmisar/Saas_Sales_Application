import ReactECharts from 'echarts-for-react';
import ChartWrapper from './ChartWrapper';
import { useTheme } from '../../hooks/useTheme';
import { TrendingUp, PieChart, BarChart2 } from 'lucide-react';
import AnimatedNumber from '../ui/AnimatedNumber';

/**
 * ProfitAnalytics — Extrapolates Profit metrics based on revenue.
 * Using a 24% Gross Margin and 18% Net Margin for demonstration purposes.
 */
export default function ProfitAnalytics({ analytics, onDrillDown }) {
  const { isDark } = useTheme();
  
  if (!analytics) return null;

  // Extrapolate profit margins
  const GROSS_MARGIN = 0.24;
  const NET_MARGIN = 0.18;
  const grossProfit = analytics.total_revenue * GROSS_MARGIN;
  const netProfit = analytics.total_revenue * NET_MARGIN;

  // Generate extrapolated profit by category (just scaled revenue + noise)
  const categoryData = analytics.category_revenue.map((c, i) => ({
    name: c.category,
    value: c.revenue * (NET_MARGIN + (i * 0.02 - 0.02))
  }));

  // Generate extrapolated profit by top products
  const productData = analytics.top_products.slice(0, 5).map((p, i) => ({
    name: p.product,
    value: p.revenue * (GROSS_MARGIN + (i * 0.03 - 0.05))
  }));

  // ── Profit by Category Chart ──────────────────────────────────────
  const categoryOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', formatter: '{b}: ${c} ({d}%)' },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      textStyle: { color: isDark ? '#94a3b8' : '#64748b' }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: {
          borderRadius: 8,
          borderColor: isDark ? '#1e293b' : '#ffffff',
          borderWidth: 2
        },
        label: { show: false },
        data: categoryData,
        color: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899']
      }
    ]
  };

  // ── Profit by Product Chart ───────────────────────────────────────
  const productOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '3%', containLabel: true },
    xAxis: {
      type: 'value',
      axisLabel: { color: isDark ? '#94a3b8' : '#64748b' },
      splitLine: { lineStyle: { color: isDark ? '#334155' : '#e2e8f0', type: 'dashed' } }
    },
    yAxis: {
      type: 'category',
      data: productData.map(d => d.name).reverse(),
      axisLabel: { color: isDark ? '#94a3b8' : '#64748b' },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    series: [
      {
        type: 'bar',
        data: productData.map(d => d.value).reverse(),
        itemStyle: {
          color: '#8b5cf6',
          borderRadius: [0, 4, 4, 0]
        }
      }
    ]
  };

  return (
    <div className="mt-8 mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-emerald-500" size={20} />
        <h2 className="text-lg font-heading font-semibold text-slate-900 dark:text-white">
          Profit Analytics
        </h2>
      </div>

      {/* Mini KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {[
          { label: 'Gross Profit', value: grossProfit, prefix: '$', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
          { label: 'Net Profit', value: netProfit, prefix: '$', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
          { label: 'Avg Profit Margin', value: NET_MARGIN * 100, prefix: '', suffix: '%', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30' },
        ].map(kpi => (
          <div key={kpi.label} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center shrink-0`}>
              <BarChart2 className={kpi.color} size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{kpi.label}</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                <AnimatedNumber value={kpi.value} decimals={1} prefix={kpi.prefix} suffix={kpi.suffix} />
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWrapper title="Profit by Category" height={320}>
          <ReactECharts
            option={categoryOption}
            style={{ height: '100%', width: '100%' }}
            onEvents={{ click: (params) => onDrillDown && onDrillDown('category', params.name) }}
          />
        </ChartWrapper>
        <ChartWrapper title="Profit by Top Products" height={320}>
          <ReactECharts
            option={productOption}
            style={{ height: '100%', width: '100%' }}
            onEvents={{ click: (params) => onDrillDown && onDrillDown('product', params.name) }}
          />
        </ChartWrapper>
      </div>
    </div>
  );
}
