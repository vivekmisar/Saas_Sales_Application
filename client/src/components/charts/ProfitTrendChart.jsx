import React from 'react';
import ReactECharts from 'echarts-for-react';
import ChartWrapper from './ChartWrapper';
import { useTheme } from '../../context/ThemeContext';

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

  if (!data || data.length === 0) return null;

  const months = data.map((d) => d.month);
  const revenues = data.map((d) => d.revenue);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderColor: isDark ? '#334155' : '#e2e8f0',
      textStyle: { color: isDark ? '#f8fafc' : '#0f172a', fontSize: 12 },
      formatter: (params) => {
        const p = params[0];
        return `<strong>${p.name}</strong><br/>Revenue: $${p.value.toLocaleString()}`;
      },
    },
    grid: { top: 20, right: 20, bottom: 30, left: 60, containLabel: false },
    xAxis: {
      type: 'category',
      data: months,
      axisLine: { lineStyle: { color: isDark ? '#475569' : '#cbd5e1' } },
      axisLabel: { color: isDark ? '#94a3b8' : '#64748b', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: isDark ? '#1e293b' : '#f1f5f9' } },
      axisLabel: {
        color: isDark ? '#94a3b8' : '#64748b',
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
              { offset: 0, color: '#10b981' },
              { offset: 1, color: '#059669' },
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
