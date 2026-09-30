import React from 'react';
import ReactECharts from 'echarts-for-react';
import ChartWrapper from './ChartWrapper';
import { useTheme } from '../../hooks/useTheme';
import { getChartTheme, getChartTooltip } from '../../lib/chartTheme';

/**
 * ProfitTrendChart — Bar chart comparing monthly revenue.
 *
 * Since the analytics engine returns monthly_revenue but not monthly_profit
 * separately, this chart visualizes the monthly revenue as bars to show
 * the distribution trend across months.
 *
 * Data source: analytics.monthly_revenue[]
 */
const ProfitTrendChart = React.memo(function ProfitTrendChart({ data, totalProfit = 0 }) {
  const { isDark } = useTheme();
  const theme = getChartTheme(isDark);

  if (!data || data.length === 0) return null;

  const months = data.map((d) => d.month);
  const revenues = data.map((d) => d.revenue);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      ...getChartTooltip(isDark),
      formatter: (params) => {
        const p = params[0];
        return `<strong>${p.name}</strong><br/>Revenue: $${p.value.toLocaleString()}`;
      },
    },
    grid: { top: 20, right: 20, bottom: 30, left: 60, containLabel: false },
    xAxis: {
      type: 'category',
      data: months,
      axisLine: { lineStyle: { color: theme.axis } },
      axisLabel: { color: theme.muted, fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: theme.grid } },
      axisLabel: {
        color: theme.muted,
        fontSize: 11,
        formatter: (v) => `$${(v / 1000).toFixed(0)}k`,
      },
    },
    series: [
      {
        type: 'bar',
        data: revenues,
        barWidth: '50%',
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#27a36a' },
              { offset: 1, color: '#0f5132' },
            ],
          },
        },
        animationDuration: 1000,
        animationEasing: 'cubicOut',
      },
    ],
  };

  const subtitle = totalProfit > 0
    ? `Total profit: $${totalProfit.toLocaleString()}`
    : 'Monthly revenue breakdown';

  return (
    <ChartWrapper title="Revenue by Month" subtitle={subtitle}>
      <ReactECharts option={option} style={{ height: 320 }} notMerge lazyUpdate />
    </ChartWrapper>
  );
});

export default ProfitTrendChart;
