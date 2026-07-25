import React from 'react';
import ReactECharts from 'echarts-for-react';
import ChartWrapper from './ChartWrapper';
import { useTheme } from '../../context/ThemeContext';

/**
 * RevenueTrendChart — Area chart showing monthly revenue over time.
 *
 * Data source: analytics.monthly_revenue[]
 * Each entry: { month: "2024-01", revenue: 29191.35 }
 */
const RevenueTrendChart = React.memo(function RevenueTrendChart({ data }) {
  const { isDark } = useTheme();

  if (!data || data.length === 0) return null;

  const months = data.map((d) => d.month);
  const revenues = data.map((d) => d.revenue);

  const option = {
    tooltip: {
      trigger: 'axis',
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
        name: 'Revenue',
        type: 'line',
        data: revenues,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 3, color: '#6366f1' },
        itemStyle: { color: '#6366f1', borderWidth: 2, borderColor: '#fff' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(99, 102, 241, 0.3)' },
              { offset: 1, color: 'rgba(99, 102, 241, 0.02)' },
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
