import React from 'react';
import ReactECharts from 'echarts-for-react';
import ChartWrapper from './ChartWrapper';
import EmptyState from '../ui/EmptyState';
import { useTheme } from '../../hooks/useTheme';
import { chartColors, getChartTheme, getChartTooltip } from '../../lib/chartTheme';
import { formatCompactCurrency, formatCurrency, formatPercent } from '../../lib/formatters';

const RegionalSalesChart = React.memo(function RegionalSalesChart({ data, onDrillDown }) {
  const { isDark } = useTheme();
  const theme = getChartTheme(isDark);
  const sorted = (Array.isArray(data) ? data : [])
    .filter((item) => item && item.region != null && Number.isFinite(Number(item.revenue)))
    .map((item) => ({ ...item, revenue: Number(item.revenue) }))
    .sort((a, b) => b.revenue - a.revenue);

  if (!sorted.length) {
    return <ChartWrapper title="Regional Performance" subtitle="Revenue across different regions"><EmptyState title="No regional data" description="Regional revenue will appear here when the report includes region totals." /></ChartWrapper>;
  }

  const total = sorted.reduce((sum, item) => sum + item.revenue, 0);
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      ...getChartTooltip(isDark),
      formatter: (params) => {
        const point = params?.[0];
        if (!point) return '';
        const share = total > 0 ? formatPercent((point.value / total) * 100) : '—';
        return `<strong>${point.name}</strong><br/>${formatCurrency(point.value)} (${share})`;
      },
    },
    grid: { top: 34, right: 24, bottom: 34, left: 56, containLabel: false },
    xAxis: {
      type: 'category',
      data: sorted.map((item) => item.region),
      axisLine: { lineStyle: { color: theme.axis } },
      axisLabel: { color: theme.muted, fontFamily: theme.fontBody, fontSize: 11, interval: 0 },
    },
    yAxis: {
      type: 'value',
      min: 0,
      splitNumber: 4,
      splitLine: { lineStyle: { color: theme.grid, type: 'dotted', width: 1 } },
      axisLabel: { color: theme.muted, fontFamily: theme.fontMono, fontSize: 10, formatter: formatCompactCurrency },
    },
    series: [{
      type: 'bar',
      data: sorted.map((item, index) => ({
        value: item.revenue,
        itemStyle: { color: index === 0 ? chartColors.primary : chartColors.primarySoft, borderRadius: [5, 5, 0, 0] },
      })),
      barWidth: '48%',
      label: { show: true, position: 'top', color: theme.muted, fontFamily: theme.fontMono, fontSize: 10, formatter: ({ value }) => formatCompactCurrency(value) },
      animationDuration: 600,
      animationEasing: 'cubicOut',
    }],
  };

  return (
    <ChartWrapper title="Regional Performance" subtitle="Revenue by region, highest first">
      <ReactECharts
        option={option}
        style={{ height: 320 }}
        notMerge
        lazyUpdate
        onEvents={{ click: (params) => onDrillDown && onDrillDown(params.name) }}
      />
    </ChartWrapper>
  );
});

export default RegionalSalesChart;
