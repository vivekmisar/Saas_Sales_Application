import React from 'react';
import ReactECharts from 'echarts-for-react';
import ChartWrapper from './ChartWrapper';
import { useTheme } from '../../hooks/useTheme';
import { chartColors, getChartTheme, getChartTooltip } from '../../lib/chartTheme';

/**
 * RevenueTrendChart — Area chart showing monthly revenue over time.
 *
 * Data source: analytics.monthly_revenue[]
 * Each entry: { month: "2024-01", revenue: 29191.35 }
 */
const RevenueTrendChart = React.memo(function RevenueTrendChart({ data }) {
  const { isDark } = useTheme();
  const theme = getChartTheme(isDark);

  if (!data || data.length === 0) return null;

  const months = data.map((d) => d.month);
  const revenues = data.map((d) => d.revenue);

  const option = {
    tooltip: {
      trigger: 'axis',
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
        name: 'Revenue',
        type: 'line',
        data: revenues,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 3, color: chartColors.primary },
        itemStyle: { color: chartColors.primary, borderWidth: 2, borderColor: theme.surface },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(39, 163, 106, 0.28)' },
              { offset: 1, color: 'rgba(39, 163, 106, 0.015)' },
            ],
          },
        },
        animationDuration: 1200,
        animationEasing: 'cubicOut',
      },
    ],
  };

  return (
    <ChartWrapper title="Revenue Trend" subtitle="Monthly revenue over time">
      <ReactECharts option={option} style={{ height: 320 }} notMerge lazyUpdate />
    </ChartWrapper>
  );
});

export default RevenueTrendChart;
