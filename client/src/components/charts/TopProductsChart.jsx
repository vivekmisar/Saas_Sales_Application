import React from 'react';
import ReactECharts from 'echarts-for-react';
import ChartWrapper from './ChartWrapper';
import { useTheme } from '../../hooks/useTheme';
import { chartColors, getChartTheme, getChartTooltip } from '../../lib/chartTheme';

/**
 * TopProductsChart — Horizontal bar chart of top products by revenue.
 *
 * Data source: analytics.top_products[]
 * Each entry: { product: "CRM Pro", revenue: 41499.17, orders: 8 }
 */
const TopProductsChart = React.memo(function TopProductsChart({ data, onDrillDown }) {
  const { isDark } = useTheme();
  const theme = getChartTheme(isDark);

  if (!data || data.length === 0) return null;

  // Reverse for horizontal bar (bottom to top, highest at top)
  const sorted = [...data].reverse();
  const products = sorted.map((d) => d.product);
  const revenues = sorted.map((d) => d.revenue);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      ...getChartTooltip(isDark),
      formatter: (params) => {
        const p = params[0];
        const item = sorted[p.dataIndex];
        return `<strong>${p.name}</strong><br/>Revenue: $${p.value.toLocaleString()}<br/>Orders: ${item.orders}`;
      },
    },
    grid: { top: 10, right: 30, bottom: 20, left: 10, containLabel: true },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: theme.grid } },
      axisLabel: {
        color: theme.muted,
        fontSize: 11,
        formatter: (v) => `$${(v / 1000).toFixed(0)}k`,
      },
    },
    yAxis: {
      type: 'category',
      data: products,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: theme.text,
        fontSize: 12,
        fontWeight: 500,
      },
    },
    series: [
      {
        type: 'bar',
        data: revenues,
        barWidth: 20,
        itemStyle: {
          borderRadius: [0, 6, 6, 0],
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: chartColors.primary },
              { offset: 1, color: chartColors.primarySoft },
            ],
          },
        },
        animationDuration: 1000,
        animationEasing: 'cubicOut',
      },
    ],
  };

  return (
    <ChartWrapper title="Top Products" subtitle="Highest revenue generating products">
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

export default TopProductsChart;
