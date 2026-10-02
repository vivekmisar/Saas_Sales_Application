import ReactECharts from 'echarts-for-react';
import ChartWrapper from './ChartWrapper';
import { useTheme } from '../../hooks/useTheme';
import { BarChart2 } from 'lucide-react';
import AnimatedNumber from '../ui/AnimatedNumber';
import { chartColors, getChartTheme, getChartTooltip } from '../../lib/chartTheme';
import DonutChart from './DonutChart';

/**
 * ProfitAnalytics — Extrapolates Profit metrics based on revenue.
 * Using a 24% Gross Margin and 18% Net Margin for demonstration purposes.
 */
export default function ProfitAnalytics({ analytics, onDrillDown }) {
  const { isDark } = useTheme();
  const theme = getChartTheme(isDark);
  
  if (!analytics) return null;

  // Extrapolate profit margins
  const GROSS_MARGIN = 0.24;
  const NET_MARGIN = 0.18;
  const grossProfit = analytics.total_revenue * GROSS_MARGIN;
  const netProfit = analytics.total_revenue * NET_MARGIN;

  // Generate extrapolated profit by category (just scaled revenue + noise)
  const categoryData = (Array.isArray(analytics.category_revenue) ? analytics.category_revenue : []).map((c, i) => ({
    name: c.category,
    value: c.revenue * (NET_MARGIN + (i * 0.02 - 0.02))
  }));

  // Generate extrapolated profit by top products
  const productData = (Array.isArray(analytics.top_products) ? analytics.top_products : []).slice(0, 5).map((p, i) => ({
    name: p.product,
    value: p.revenue * (GROSS_MARGIN + (i * 0.03 - 0.05))
  }));

  // ── Profit by Product Chart ───────────────────────────────────────
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
    <div className="app-analytics-section app-profit-section animate-fade-in" style={{ animationDelay: '100ms' }}>
      <div className="app-analytics-heading">
        <div><span className="app-section-kicker">Estimated performance</span><h2>Profit Analytics</h2></div>
        <span className="app-estimate-label" title="Profit is estimated from revenue using assumed gross and net margins.">Illustrative estimate · assumed margins</span>
      </div>

      {/* Mini KPIs */}
      <div className="app-analytics-kpi-group">
        {[
          { label: 'Gross Profit', value: grossProfit, prefix: '$' },
          { label: 'Net Profit', value: netProfit, prefix: '$' },
          { label: 'Avg Profit Margin', value: NET_MARGIN * 100, prefix: '', suffix: '%' },
        ].map(kpi => (
          <div key={kpi.label} className="app-analytics-kpi-cell">
              <p className="app-analytics-kpi-label"><BarChart2 size={15} aria-hidden="true" />{kpi.label}</p>
              <p className="app-analytics-kpi-value">
                <AnimatedNumber value={kpi.value} decimals={1} prefix={kpi.prefix} suffix={kpi.suffix} />
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
          <ReactECharts
            option={productOption}
            style={{ height: Math.max(280, productData.length * 48), width: '100%' }}
            onEvents={{ click: (params) => onDrillDown && onDrillDown('product', params.name) }}
          />
        </ChartWrapper>
      </div>
    </div>
  );
}
