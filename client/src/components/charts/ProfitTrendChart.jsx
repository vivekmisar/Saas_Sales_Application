import React from 'react';
import ReactECharts from 'echarts-for-react';
import ChartWrapper from './ChartWrapper';
import EmptyState from '../ui/EmptyState';
import { useTheme } from '../../hooks/useTheme';
import { chartColors, getChartTheme, getChartTooltip } from '../../lib/chartTheme';
import { formatCompactCurrency, formatCurrency } from '../../lib/formatters';

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

const ProfitTrendChart = React.memo(function ProfitTrendChart({ data, totalProfit = 0 }) {
  const { isDark } = useTheme();
  const theme = getChartTheme(isDark);
  const safeData = Array.isArray(data) ? data.filter((item) => item && item.month != null && Number.isFinite(Number(item.revenue))) : [];

  if (!safeData.length) {
    return <ChartWrapper title="Revenue by Month" subtitle="Monthly revenue breakdown"><EmptyState title="No monthly revenue" description="Monthly totals will appear here when the report contains revenue data." /></ChartWrapper>;
  }

  const months = safeData.map((item) => item.month);
  const revenues = safeData.map((item) => Number(item.revenue));
  const previousMedian = median(revenues.slice(0, -1));
  const isLatestPartial = revenues.length > 1 && previousMedian > 0 && revenues.at(-1) < previousMedian * .4;
  const lastIndex = safeData.length - 1;
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      ...getChartTooltip(isDark),
      formatter: (params) => {
        const point = params?.[0];
        if (!point) return '';
        const note = isLatestPartial && point.dataIndex === lastIndex ? '<br/><span style="color:#7c827c">Latest period may be incomplete</span>' : '';
        return `<strong>${point.name}</strong><br/>Revenue: ${formatCurrency(point.value)}${note}`;
      },
    },
    grid: { top: 26, right: 20, bottom: 30, left: 62, containLabel: false },
    xAxis: {
      type: 'category',
      data: months,
      axisLine: { lineStyle: { color: theme.axis } },
      axisLabel: { color: theme.muted, fontFamily: theme.fontBody, fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitNumber: 4,
      min: 0,
      splitLine: { lineStyle: { color: theme.grid } },
      axisLabel: { color: theme.muted, fontFamily: theme.fontMono, fontSize: 10, formatter: formatCompactCurrency },
    },
    series: [{
      type: 'bar',
      data: revenues.map((value, index) => ({
        value,
        itemStyle: { color: isLatestPartial && index === lastIndex ? (isDark ? '#5d7968' : '#a7c4af') : chartColors.primarySoft },
      })),
      barWidth: '50%',
      itemStyle: { borderRadius: [5, 5, 0, 0] },
      animationDuration: 600,
      animationEasing: 'cubicOut',
    }],
  };

  const subtitle = Number(totalProfit) > 0
    ? `Total profit estimate: ${formatCurrency(totalProfit)}`
    : 'Monthly revenue breakdown';

  return (
    <ChartWrapper title="Revenue by Month" subtitle={subtitle}>
      <ReactECharts option={option} style={{ height: 320 }} notMerge lazyUpdate />
    </ChartWrapper>
  );
});

export default ProfitTrendChart;
