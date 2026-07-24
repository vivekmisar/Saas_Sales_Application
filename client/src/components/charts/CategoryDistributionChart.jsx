import React from 'react';
import ReactECharts from 'echarts-for-react';
import ChartWrapper from './ChartWrapper';
import { useTheme } from '../../context/ThemeContext';

/**
 * CategoryDistributionChart — Donut chart showing revenue by category.
 *
 * Data source: analytics.category_revenue[]
 * Each entry: { category: "Enterprise", revenue: 60774.08 }
 */

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f43f5e'];

const CategoryDistributionChart = React.memo(function CategoryDistributionChart({ data, onDrillDown }) {
  const { isDark } = useTheme();

  if (!data || data.length === 0) return null;

  const chartData = data.map((d, i) => ({
    name: d.category,
    value: d.revenue,
    itemStyle: { color: COLORS[i % COLORS.length] },
  }));

  const total = data.reduce((sum, d) => sum + d.revenue, 0);

  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderColor: isDark ? '#334155' : '#e2e8f0',
      textStyle: { color: isDark ? '#f8fafc' : '#0f172a', fontSize: 12 },
      formatter: (p) =>
        `<strong>${p.name}</strong><br/>$${p.value.toLocaleString()} (${p.percent}%)`,
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { color: isDark ? '#94a3b8' : '#64748b', fontSize: 12 },
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 12,
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '78%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: `$${(total / 1000).toFixed(1)}k`,
          fontSize: 18,
          fontWeight: 700,
          color: isDark ? '#f8fafc' : '#0f172a',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 600,
            formatter: '{b}\n${c}',
          },
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.15)' },
        },
        labelLine: { show: false },
        data: chartData,
        animationType: 'scale',
        animationDuration: 1000,
        animationEasing: 'cubicOut',
      },
    ],
  };

  return (
    <ChartWrapper title="Category Distribution" subtitle="Revenue share by category">
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

export default CategoryDistributionChart;
