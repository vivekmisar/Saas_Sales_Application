import ReactECharts from 'echarts-for-react';
import ChartWrapper from './ChartWrapper';
import { useTheme } from '../../hooks/useTheme';
import { Percent, Tag, Activity } from 'lucide-react';
import AnimatedNumber from '../ui/AnimatedNumber';
import { chartColors, getChartTheme, getChartTooltip } from '../../lib/chartTheme';
import { formatCompactCurrency, formatCurrency } from '../../lib/formatters';
import EmptyState from '../ui/EmptyState';

const truncateLabel = (name, maxLength = 20) => (name.length > maxLength ? `${name.slice(0, maxLength - 1)}…` : name);

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
  const revenue = Number.isFinite(Number(analytics.total_revenue)) ? Number(analytics.total_revenue) : 0;
  const revenueLost = revenue * (AVG_DISCOUNT / (1 - AVG_DISCOUNT)); // Extrapolate pre-discount gross
  const discountImpact = AVG_DISCOUNT * 100; 

  // Generate top discounted products (just selecting and scaling existing products)
  const productData = (Array.isArray(analytics.top_products) ? analytics.top_products : []).filter((p) => p && Number.isFinite(Number(p.revenue))).slice(0, 5).map((p, i) => ({
    name: p.product,
    value: Number(p.revenue) * (AVG_DISCOUNT + (i * 0.02)), // Illustrative allocation
  })).sort((a, b) => b.value - a.value);
  const displayProducts = [...productData].reverse();

  // ── Top Discounted Products Chart ─────────────────────────────────
  const productOption = {
    backgroundColor: 'transparent',
    tooltip: { ...getChartTooltip(isDark), trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (params) => {
      const point = params?.[0];
      return point ? `<strong>${point.name}</strong><br/>Estimated revenue lost: ${formatCurrency(point.value)}` : '';
    } },
    grid: { left: 148, right: 92, bottom: 16, top: 12, containLabel: false },
    xAxis: {
      type: 'value',
      min: 0,
      splitNumber: 4,
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'category',
      data: displayProducts.map(d => d.name),
      axisLabel: { color: theme.text, fontFamily: theme.fontBody, fontSize: 12, interval: 0, width: 138, overflow: 'truncate', formatter: (name) => truncateLabel(String(name)), tooltip: { show: true } },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: true, lineStyle: { color: theme.grid, type: 'dotted' } }
    },
    series: [
      {
        type: 'bar',
        data: displayProducts.map((d, index) => ({ value: d.value, itemStyle: { color: index === displayProducts.length - 1 ? chartColors.negative : (isDark ? '#c58673' : '#d8947f') } })),
        barWidth: 13,
        label: { show: true, position: 'right', color: theme.muted, fontFamily: theme.fontMono, fontSize: 10, formatter: ({ value }) => formatCompactCurrency(value) },
        itemStyle: {
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
        {displayProducts.length
          ? <ReactECharts option={productOption} style={{ height: Math.max(280, displayProducts.length * 48), width: '100%' }} />
          : <EmptyState title="No product data" description="Estimated revenue impact appears when the report contains product revenue." />}
      </ChartWrapper>
    </div>
  );
}
