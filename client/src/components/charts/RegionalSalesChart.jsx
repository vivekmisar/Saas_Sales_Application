import React from 'react';
import ReactECharts from 'echarts-for-react';
import ChartWrapper from './ChartWrapper';
import { useTheme } from '../../context/ThemeContext';

/**
 * RegionalSalesChart — Bar chart showing revenue by region.
 *
 * Data source: analytics.region_revenue[]
 * Each entry: { region: "North America", revenue: 39382.87 }
 */

const REGION_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

const RegionalSalesChart = React.memo(function RegionalSalesChart({ data, onDrillDown }) {
  const { isDark } = useTheme();

  if (!data || data.length === 0) return null;

  const regions = data.map((d) => d.region);
  const revenues = data.map((d) => d.revenue);
  const colors = data.map((_, i) => REGION_COLORS[i % REGION_COLORS.length]);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderColor: isDark ? '#334155' : '#e2e8f0',
      textStyle: { color: isDark ? '#f8fafc' : '#0f172a', fontSize: 12 },
      formatter: (params) => {
        const p = params[0];
        const total = revenues.reduce((a, b) => a + b, 0);
        const pct = ((p.value / total) * 100).toFixed(1);
        return `<strong>${p.name}</strong><br/>$${p.value.toLocaleString()} (${pct}%)`;
      },
    },
    grid: { top: 20, right: 20, bottom: 30, left: 60, containLabel: false },
    xAxis: {
      type: 'category',
      data: regions,
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
        data: revenues.map((val, i) => ({
          value: val,
          itemStyle: {
            color: colors[i],
            borderRadius: [6, 6, 0, 0],
          },
        })),
        barWidth: '50%',
        animationDuration: 1000,
        animationEasing: 'cubicOut',
      },
    ],
  };

  return (
    <ChartWrapper title="Regional Performance" subtitle="Revenue across different regions">
      <ReactECharts
        option={option}
        style={{ height: 300 }}
        notMerge
        lazyUpdate
        onEvents={{
          click: (params) => {
            if (onDrillDown) onDrillDown(params.name);
          }
        }}
      />
    </ChartWrapper>
  );
});

export default RegionalSalesChart;
