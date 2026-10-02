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
  const productData = (Array.isArray(analytics.top_products) ? analytics.top_products : []).slice(0, 5).map((p, i) => ({
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
    <div className="app-analytics-section app-discount-section animate-fade-in" style={{ animationDelay: '200ms' }}>
      <div className="app-analytics-heading">
        <div><span className="app-section-kicker">Estimated performance</span><h2>Discount Analytics</h2></div>
        <span className="app-estimate-label" title="Revenue impact is estimated using an assumed average 8.5% discount rate.">Illustrative estimate · assumed 8.5% rate</span>
      </div>

      {/* Mini KPIs */}
      <div className="app-analytics-kpi-group">
        {[
          { label: 'Avg Discount', value: discountImpact, prefix: '', suffix: '%', icon: Tag },
          { label: 'Revenue Lost (Est)', value: revenueLost, prefix: '$', suffix: '', icon: Activity },
          { label: 'Discount Impact', value: discountImpact * 1.2, prefix: '', suffix: '%', icon: Percent },
        ].map(kpi => (
          <div key={kpi.label} className="app-analytics-kpi-cell">
              <p className="app-analytics-kpi-label"><kpi.icon size={15} aria-hidden="true" />{kpi.label}</p>
              <p className="app-analytics-kpi-value">
                <AnimatedNumber value={kpi.value} decimals={1} prefix={kpi.prefix} suffix={kpi.suffix} />
              </p>
          </div>
        ))}
      </div>

      <ChartWrapper title="Revenue Lost by Top Products" className="app-tall-chart-card">
        <ReactECharts option={productOption} style={{ height: Math.max(280, productData.length * 48), width: '100%' }} />
      </ChartWrapper>
    </div>
  );
}
