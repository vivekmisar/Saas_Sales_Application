import React from 'react';
import ReactECharts from 'echarts-for-react';
import ChartWrapper from './ChartWrapper';
import EmptyState from '../ui/EmptyState';
import { useTheme } from '../../hooks/useTheme';
import { chartColors, getChartTheme, getChartTooltip } from '../../lib/chartTheme';
import { formatCompactCurrency, formatCurrency } from '../../lib/formatters';
import useReducedMotion from '../../hooks/useReducedMotion';

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

const RevenueTrendChart = React.memo(function RevenueTrendChart({ data }) {
  const { isDark } = useTheme();
  const reducedMotion = useReducedMotion();
  const theme = getChartTheme(isDark);
  const safeData = Array.isArray(data) ? data.filter((item) => item && item.month != null && Number.isFinite(Number(item.revenue))) : [];

  if (!safeData.length) {
    return <ChartWrapper title="Revenue Trend" subtitle="Monthly revenue over time"><EmptyState title="No monthly revenue" description="Revenue trend data will appear here when the report contains monthly totals." /></ChartWrapper>;
  }

  const months = safeData.map((item) => item.month);
  const revenues = safeData.map((item) => Number(item.revenue));
  const previousMedian = median(revenues.slice(0, -1));
  const isLatestPartial = revenues.length > 1 && previousMedian > 0 && revenues.at(-1) < previousMedian * .4;
  const lastIndex = safeData.length - 1;
  const option = {
    animation: !reducedMotion,
    tooltip: {
      trigger: 'axis',
      ...getChartTooltip(isDark),
      formatter: (params) => {
        const point = params?.[0];
        if (!point) return '';
        const note = isLatestPartial && point.dataIndex === lastIndex ? '<br/><span style="color:#7c827c">Latest period may be incomplete</span>' : '';
        return `<strong>${point.name}</strong><br/>Revenue: ${formatCurrency(point.value)}${note}`;
      },
    },
    grid: { top: isLatestPartial ? 38 : 20, right: 22, bottom: 30, left: 60, containLabel: false },
    xAxis: {
      type: 'category',
      data: months,
      axisLine: { lineStyle: { color: theme.axis } },
      axisLabel: { color: theme.muted, fontFamily: theme.fontBody, fontSize: 11, hideOverlap: true },
    },
    yAxis: {
      type: 'value',
      splitNumber: 4,
      min: 0,
      splitLine: { lineStyle: { color: theme.grid } },
      axisLabel: {
        color: theme.muted,
        fontFamily: theme.fontMono,
        fontSize: 10,
        formatter: formatCompactCurrency,
      },
    },
    series: [{
      name: 'Revenue',
      type: 'line',
      data: revenues,
      smooth: true,
      showSymbol: true,
      symbol: 'circle',
      symbolSize: (value, params) => (params.dataIndex === lastIndex ? 8 : 0),
      emphasis: { scale: true, focus: 'series' },
      lineStyle: { width: 1.75, color: chartColors.primary },
      itemStyle: { color: chartColors.primary, borderWidth: 2, borderColor: theme.surface },
      areaStyle: { color: isDark ? 'rgba(139, 197, 160, 0.08)' : 'rgba(39, 163, 106, 0.08)' },
      markPoint: isLatestPartial ? {
        symbol: 'roundRect',
        symbolSize: [58, 20],
        symbolOffset: [0, -18],
        itemStyle: { color: isDark ? '#293d30' : '#edf4ef' },
        label: { show: true, formatter: 'Partial', color: theme.muted, fontFamily: theme.fontMono, fontSize: 9 },
        data: [{ coord: [months[lastIndex], revenues[lastIndex]] }],
      } : undefined,
      animationDuration: reducedMotion ? 0 : 600,
      animationEasing: 'cubicOut',
    }],
  };

  return (
    <ChartWrapper title="Revenue Trend" subtitle="Monthly revenue over time">
      <ReactECharts option={option} style={{ height: 320 }} notMerge lazyUpdate />
    </ChartWrapper>
  );
});

export default RevenueTrendChart;
