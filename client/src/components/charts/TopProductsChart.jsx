import React from 'react';
import ReactECharts from 'echarts-for-react';
import ChartWrapper from './ChartWrapper';
import EmptyState from '../ui/EmptyState';
import { useTheme } from '../../hooks/useTheme';
import { chartColors, getChartTheme, getChartTooltip } from '../../lib/chartTheme';
import { formatCompactCurrency, formatCurrency, formatInteger } from '../../lib/formatters';

const truncateLabel = (name, maxLength = 20) => (name.length > maxLength ? `${name.slice(0, maxLength - 1)}…` : name);

const TopProductsChart = React.memo(function TopProductsChart({ data, onDrillDown }) {
  const { isDark } = useTheme();
  const theme = getChartTheme(isDark);
  const sortedDescending = (Array.isArray(data) ? data : [])
    .filter((item) => item && item.product != null && Number.isFinite(Number(item.revenue)))
    .map((item) => ({ ...item, revenue: Number(item.revenue) }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  if (!sortedDescending.length) {
    return <ChartWrapper title="Top Products" subtitle="Highest revenue generating products"><EmptyState title="No product data" description="Product revenue will appear here when the report contains product totals." /></ChartWrapper>;
  }

  const displayItems = [...sortedDescending].reverse();
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      ...getChartTooltip(isDark),
      formatter: (params) => {
        const point = params?.[0];
        if (!point) return '';
        const item = displayItems[point.dataIndex];
        return `<strong>${point.name}</strong><br/>Revenue: ${formatCurrency(point.value)}<br/>Orders: ${formatInteger(item?.orders)}`;
      },
    },
    grid: { top: 12, right: 92, bottom: 16, left: 148, containLabel: false },
    xAxis: {
      type: 'value',
      min: 0,
      splitNumber: 4,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'category',
      data: displayItems.map((item) => item.product),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: theme.text,
        fontFamily: theme.fontBody,
        fontSize: 12,
        interval: 0,
        width: 138,
        overflow: 'truncate',
        formatter: (value) => truncateLabel(String(value)),
        tooltip: { show: true },
      },
      splitLine: { show: true, lineStyle: { color: theme.grid, type: 'dotted', width: 1 } },
    },
    series: [{
      type: 'bar',
      data: displayItems.map((item, index) => ({
        value: item.revenue,
        itemStyle: { color: index === displayItems.length - 1 ? chartColors.primary : chartColors.primarySoft, borderRadius: [0, 4, 4, 0] },
      })),
      barWidth: 13,
      label: { show: true, position: 'right', color: theme.muted, fontFamily: theme.fontMono, fontSize: 10, formatter: ({ value }) => formatCompactCurrency(value) },
      animationDuration: 600,
      animationEasing: 'cubicOut',
    }],
  };

  return (
    <ChartWrapper title="Top Products" subtitle="Highest revenue generating products">
      <ReactECharts
        option={option}
        style={{ height: Math.max(280, displayItems.length * 48) }}
        notMerge
        lazyUpdate
        onEvents={{ click: (params) => onDrillDown && onDrillDown(params.name) }}
      />
    </ChartWrapper>
  );
});

export default TopProductsChart;
