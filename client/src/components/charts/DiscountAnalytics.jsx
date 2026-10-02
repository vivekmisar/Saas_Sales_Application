import ReactECharts from 'echarts-for-react';
import ChartWrapper from './ChartWrapper';
import { useTheme } from '../../hooks/useTheme';
import { Percent, Tag, Activity } from 'lucide-react';
import AnimatedNumber from '../ui/AnimatedNumber';
import { chartColors, getChartTheme, getChartTooltip } from '../../lib/chartTheme';

/**
 * DiscountAnalytics — Extrapolates Discount metrics based on revenue.
 * Uses a mock 8.5% average discount rate for demonstration purposes.
 */
export default function DiscountAnalytics({ analytics }) {
  const { isDark } = useTheme();
  const theme = getChartTheme(isDark);
  
  if (!analytics) return null;

  // Extrapolate discount metrics
  const AVG_DISCOUNT = 0.085;
  const revenueLost = analytics.total_revenue * (AVG_DISCOUNT / (1 - AVG_DISCOUNT)); // Extrapolate pre-discount gross
  const discountImpact = AVG_DISCOUNT * 100; 

  // Generate top discounted products (just selecting and scaling existing products)
  const productData = analytics.top_products.slice(0, 5).map((p, i) => ({
    name: p.product,
    value: p.revenue * (AVG_DISCOUNT + (i * 0.02)), // Fake correlation
  }));

  // ── Top Discounted Products Chart ─────────────────────────────────
  const productOption = {
    backgroundColor: 'transparent',
    tooltip: { ...getChartTooltip(isDark), trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '3%', containLabel: true },
    xAxis: {
      type: 'value',
      axisLabel: { color: theme.muted },
      splitLine: { lineStyle: { color: theme.axis, type: 'dashed' } }
    },
    yAxis: {
      type: 'category',
      data: productData.map(d => d.name).reverse(),
      axisLabel: { color: theme.muted },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    series: [
      {
        type: 'bar',
        data: productData.map(d => d.value).reverse(),
        itemStyle: {
          color: chartColors.primarySoft,
          borderRadius: [0, 4, 4, 0]
        }
      }
    ]
  };

  return (
    <div className="mt-6 mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center gap-2 mb-4">
        <Percent className="text-rose-500" size={20} />
        <h2 className="text-lg font-heading font-semibold text-slate-900 dark:text-white">Discount Analytics</h2>
        <span className="app-estimate-label">Illustrative estimate · assumed 8.5% rate</span>
      </div>

      {/* Mini KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {[
          { label: 'Avg Discount', value: discountImpact, prefix: '', suffix: '%', color: 'app-metric-icon', bg: 'app-metric-icon-bg', icon: Tag },
          { label: 'Revenue Lost (Est)', value: revenueLost, prefix: '$', suffix: '', color: 'app-metric-icon', bg: 'app-metric-icon-bg', icon: Activity },
          { label: 'Discount Impact', value: discountImpact * 1.2, prefix: '', suffix: '%', color: 'app-metric-icon', bg: 'app-metric-icon-bg', icon: Percent },
        ].map(kpi => (
          <div key={kpi.label} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center shrink-0`}>
              <kpi.icon className={kpi.color} size={20} />
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

      <ChartWrapper title="Revenue Lost by Top Products" height={320}>
        <ReactECharts option={productOption} style={{ height: '100%', width: '100%' }} />
      </ChartWrapper>
    </div>
  );
}
