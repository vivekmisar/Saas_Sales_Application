import ReactECharts from 'echarts-for-react';
import ChartWrapper from './ChartWrapper';
import { useTheme } from '../../hooks/useTheme';
import { BarChart2 } from 'lucide-react';
import AnimatedNumber from '../ui/AnimatedNumber';
import { chartColors, getChartTheme, getChartTooltip } from '../../lib/chartTheme';
import { formatCompactCurrency, formatCurrency, formatPercent } from '../../lib/formatters';
import DonutChart from './DonutChart';
import EmptyState from '../ui/EmptyState';
import useReducedMotion from '../../hooks/useReducedMotion';

const truncateLabel = (name, maxLength = 20) => (name.length > maxLength ? `${name.slice(0, maxLength - 1)}…` : name);

/**
 * ProfitAnalytics — Extrapolates Profit metrics based on revenue.
 * Using a 24% Gross Margin and 18% Net Margin for demonstration purposes.
 */
export default function ProfitAnalytics({ analytics, onDrillDown }) {
  const { isDark } = useTheme();
  const reducedMotion = useReducedMotion();
  const theme = getChartTheme(isDark);
  
  if (!analytics) return null;

  // Extrapolate profit margins
  const GROSS_MARGIN = 0.24;
  const NET_MARGIN = 0.18;
  const revenue = Number.isFinite(Number(analytics.total_revenue)) ? Number(analytics.total_revenue) : 0;
  const grossProfit = revenue * GROSS_MARGIN;
  const netProfit = revenue * NET_MARGIN;

  // Generate extrapolated profit by category (just scaled revenue + noise)
  const categoryData = (Array.isArray(analytics.category_revenue) ? analytics.category_revenue : []).filter((c) => c && Number.isFinite(Number(c.revenue))).map((c, i) => ({
    name: c.category,
    value: Number(c.revenue) * (NET_MARGIN + (i * 0.02 - 0.02))
  }));

  // Generate extrapolated profit by top products
  const productData = (Array.isArray(analytics.top_products) ? analytics.top_products : []).filter((p) => p && Number.isFinite(Number(p.revenue))).slice(0, 5).map((p, i) => ({
    name: p.product,
    value: Number(p.revenue) * (GROSS_MARGIN + (i * 0.03 - 0.05))
  })).sort((a, b) => b.value - a.value);
  const displayProducts = [...productData].reverse();

  // ── Profit by Product Chart ───────────────────────────────────────
  const productOption = {
    animation: !reducedMotion,
    backgroundColor: 'transparent',
    tooltip: { ...getChartTooltip(isDark), trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (params) => {
      const point = params?.[0];
      return point ? `<strong>${point.name}</strong><br/>Estimated profit: ${formatCurrency(point.value)}` : '';
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
        data: displayProducts.map((d, index) => ({ value: d.value, itemStyle: { color: index === displayProducts.length - 1 ? chartColors.primary : chartColors.primarySoft } })),
        barWidth: 13,
        label: { show: true, position: 'right', color: theme.muted, fontFamily: theme.fontMono, fontSize: 10, formatter: ({ value }) => formatCompactCurrency(value) },
        itemStyle: {
          borderRadius: [0, 4, 4, 0]
        }
      }
    ]
  };

  return (
    <div className="app-analytics-section app-profit-section animate-fade-in" style={{ animationDelay: '100ms' }}>
      <div className="app-analytics-heading">
        <div><span className="app-section-kicker">Estimated performance</span><h2>Profit Analytics</h2></div>
        <span className="app-estimate-label" title="Profit is estimated from revenue using assumed gross and net margins.">Illustrative estimate · assumed margins</span>
      </div>

      {/* Mini KPIs */}
      <div className="app-analytics-kpi-group">
        {[
          { label: 'Gross Profit', value: grossProfit, format: formatCompactCurrency },
          { label: 'Net Profit', value: netProfit, format: formatCompactCurrency },
          { label: 'Avg Profit Margin', value: NET_MARGIN * 100, format: formatPercent },
        ].map(kpi => (
          <div key={kpi.label} className="app-analytics-kpi-cell">
              <p className="app-analytics-kpi-label"><BarChart2 size={15} aria-hidden="true" />{kpi.label}</p>
              <p className="app-analytics-kpi-value">
                <AnimatedNumber value={kpi.value} format={kpi.format} />
              </p>
          </div>
        ))}
      </div>

      <div className="app-analytics-chart-grid">
        <DonutChart
          title="Profit by Category"
          subtitle="Illustrative estimate from assumed margins"
          data={categoryData}
          onDrillDown={(category) => onDrillDown && onDrillDown('category', category)}
        />
        <ChartWrapper title="Profit by Top Products" className="app-tall-chart-card">
          {displayProducts.length ? <ReactECharts
              option={productOption}
              style={{ height: Math.max(280, displayProducts.length * 48), width: '100%' }}
              onEvents={{ click: (params) => onDrillDown && onDrillDown('product', params.name) }}
            /> : <EmptyState title="No product data" description="Estimated product profit appears when the report contains product revenue." />}
        </ChartWrapper>
      </div>
    </div>
  );
}
