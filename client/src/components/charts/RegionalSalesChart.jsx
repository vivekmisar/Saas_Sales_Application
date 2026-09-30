import React from 'react';
import ReactECharts from 'echarts-for-react';
import ChartWrapper from './ChartWrapper';
import { useTheme } from '../../hooks/useTheme';
import { chartColors, getChartTheme, getChartTooltip } from '../../lib/chartTheme';

/**
 * RegionalSalesChart — Bar chart showing revenue by region.
 *
 * Data source: analytics.region_revenue[]
 * Each entry: { region: "North America", revenue: 39382.87 }
 */

const REGION_COLORS = chartColors.palette;

const RegionalSalesChart = React.memo(function RegionalSalesChart({ data, onDrillDown }) {
  const { isDark } = useTheme();
  const theme = getChartTheme(isDark);

  if (!data || data.length === 0) return null;

  const regions = data.map((d) => d.region);
  const revenues = data.map((d) => d.revenue);
  const colors = data.map((_, i) => REGION_COLORS[i % REGION_COLORS.length]);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      ...getChartTooltip(isDark),
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
