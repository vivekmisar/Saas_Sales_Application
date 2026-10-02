import { useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import ChartWrapper from './ChartWrapper';
import EmptyState from '../ui/EmptyState';
import { useTheme } from '../../hooks/useTheme';
import { getChartPalette, getChartTheme } from '../../lib/chartTheme';
import { formatCompactCurrency, formatCurrency, formatPercent } from '../../lib/formatters';

const compactValue = (value) => formatCompactCurrency(value);
const fullValue = (value) => formatCurrency(value);

export default function DonutChart({
  title,
  subtitle,
  data,
  valueKey = 'value',
  nameKey = 'name',
  onDrillDown,
  emptyDescription = 'There is no category data to display for this report.',
}) {
  const { isDark } = useTheme();
  const theme = getChartTheme(isDark);
  const palette = getChartPalette(isDark);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeSource, setActiveSource] = useState(null);
  const safeData = useMemo(() => (Array.isArray(data) ? data : [])
    .map((item) => ({
      name: item?.[nameKey] == null ? '' : String(item[nameKey]),
      value: Number(item?.[valueKey]),
    }))
    .filter((item) => item.name && Number.isFinite(item.value) && item.value >= 0), [data, nameKey, valueKey]);
  const total = safeData.reduce((sum, item) => sum + item.value, 0);
  const activeItem = activeIndex == null ? null : safeData[activeIndex];

  const option = useMemo(() => ({
    animationDuration: 250,
    tooltip: {
      show: false,
      trigger: 'item',
    },
    series: [{
      type: 'pie',
      radius: ['58%', '82%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      label: { show: false },
      labelLine: { show: false },
      selectedMode: false,
      itemStyle: {
        borderColor: theme.surface,
        borderWidth: 2,
        borderRadius: 2,
        opacity: 1,
      },
      emphasis: {
        scale: true,
        scaleSize: 4,
        focus: 'self',
        itemStyle: { opacity: 1 },
      },
      blur: { itemStyle: { opacity: 0.55 } },
      data: safeData.map((item, index) => ({
        ...item,
        itemStyle: { color: palette[index % palette.length] },
      })),
    }],
  }), [safeData, theme, palette]);

  const activate = (index, source) => {
    setActiveIndex(index);
    setActiveSource(source);
  };
  const clearSource = (source) => {
    if (activeSource === source) {
      setActiveIndex(null);
      setActiveSource(null);
    }
  };

  return (
    <ChartWrapper title={title} subtitle={subtitle} className="app-donut-card">
      {safeData.length === 0 ? (
        <EmptyState title="No category data" description={emptyDescription} />
      ) : (
        <div className="app-donut-layout">
          <div className="app-donut-visual" onMouseLeave={() => clearSource('chart')}>
            <ReactECharts
                option={option}
                style={{ height: 300, width: '100%' }}
                notMerge
                lazyUpdate
                onEvents={{
                  mouseover: (params) => {
                    if (params.seriesType === 'pie' && Number.isInteger(params.dataIndex)) activate(params.dataIndex, 'chart');
                  },
                  globalout: () => clearSource('chart'),
                  click: (params) => {
                    if (params.seriesType === 'pie' && onDrillDown) onDrillDown(params.name);
                  },
                }}
              />
            <div className="app-donut-center" aria-live="polite">
              {activeItem ? (
                <>
                  <span className="app-donut-center-title">{activeItem.name}</span>
                  <strong>{compactValue(activeItem.value)}</strong>
                  <span className="app-donut-center-meta">
                    {total > 0 ? `${formatPercent((activeItem.value / total) * 100)} share` : '0.0% share'}
                  </span>
                </>
              ) : (
                <>
                  <span className="app-donut-center-title">Total</span>
                  <strong>{compactValue(total)}</strong>
                </>
              )}
            </div>
          </div>
          <div className="app-donut-legend" role="list" aria-label={`${title} legend`} onMouseLeave={() => clearSource('legend')}>
            {safeData.map((item, index) => {
              const percentage = total > 0 ? (item.value / total) * 100 : 0;
              const isActive = activeIndex === index;
              return (
                <div role="listitem" key={`${item.name}-${index}`}>
                  <button
                    type="button"
                    className={`app-donut-legend-row${isActive ? ' is-active' : ''}`}
                    onMouseEnter={() => activate(index, 'legend')}
                    onFocus={() => activate(index, 'legend')}
                    onBlur={(event) => {
                      if (!event.relatedTarget?.closest?.('.app-donut-legend')) clearSource('legend');
                    }}
                    onTouchStart={() => activate(index, 'legend')}
                    title={`${item.name}: ${fullValue(item.value)} (${formatPercent(percentage)})`}
                  >
                    <span className="app-donut-legend-dot" style={{ '--donut-color': chartColors.palette[index % chartColors.palette.length] }} />
                    <span className="app-donut-legend-name">{item.name}</span>
                    <span className="app-donut-legend-value">{compactValue(item.value)}</span>
                    <span className="app-donut-legend-share">{formatPercent(percentage)}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ChartWrapper>
  );
}
