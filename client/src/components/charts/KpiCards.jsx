import { DollarSign, ShoppingCart, Users, TrendingUp, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import AnimatedNumber from '../ui/AnimatedNumber';
import { formatCompactCurrency, formatNumber, formatPercent } from '../../lib/formatters';

/**
 * KpiCards — top-level KPI stat cards.
 *
 * Renders 5 cards in a responsive grid:
 *   - Total Revenue
 *   - Total Orders
 *   - Total Customers
 *   - Average Order Value
 *   - Reported Profit
 *
 * All values come from the analytics JSON — nothing is hardcoded.
 */

const kpiConfig = [
  {
    key: 'total_revenue',
    label: 'Total Revenue',
    icon: DollarSign,
    format: formatCompactCurrency,
  },
  {
    key: 'total_orders',
    label: 'Total Orders',
    icon: ShoppingCart,
    format: formatNumber,
  },
  {
    key: 'total_customers',
    label: 'Customers',
    help: 'Uses unique customer IDs when available. When the file has no customer ID column, analytics falls back to the order count.',
    icon: Users,
    format: formatNumber,
  },
  {
    key: 'average_order_value',
    label: 'Avg. Order Value',
    icon: TrendingUp,
    format: formatCompactCurrency,
  },
  {
    key: 'total_profit',
    label: 'Reported Profit',
    help: 'Read from the uploaded file’s profit column. If no profit column is detected, the analytics engine returns $0.',
    icon: PiggyBank,
    format: formatCompactCurrency,
  },
];

export default function KpiCards({ analytics, compareAnalytics }) {
  if (!analytics) return null;

  // Calculate actual trend if compareAnalytics is provided
  const getTrendData = (key, value) => {
    if (value === null || value === undefined || compareAnalytics?.[key] === null || compareAnalytics?.[key] === undefined
      || !compareAnalytics || !Number.isFinite(Number(value)) || !Number.isFinite(Number(compareAnalytics[key]))) {
      return null;
    }
    
    const compareValue = compareAnalytics[key];
    if (compareValue === 0) return { trend: '—', isPositive: true };

    const diff = value - compareValue;
    const growth = (diff / compareValue) * 100;
    const isPositive = growth >= 0;
    
    return {
      trend: `${isPositive ? '+' : ''}${formatPercent(growth)}`,
      isPositive,
    };
  };

  return (
    <div className="app-kpi-strip">
      {kpiConfig.map(({ key, label, icon: Icon, format, help }, i) => {
        const value = analytics[key];
        const trendData = getTrendData(key, value);
        const TrendIcon = trendData?.isPositive ? ArrowUpRight : ArrowDownRight;
        const trendColor = trendData?.isPositive ? 'text-emerald-600' : 'text-rose-500';
        
        return (
          <div
            key={key}
            className="app-kpi-card animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="app-kpi-card-inner">
              <div className="app-kpi-label-row">
                <p title={help || undefined}>{label}</p>
                <Icon size={15} aria-hidden="true" />
              </div>
              <p className="app-kpi-value">
                <AnimatedNumber
                  value={value}
                  format={format}
                />
              </p>
              {trendData && <div className={`app-kpi-trend ${trendColor}`} title="Change from the selected comparison report">
                <TrendIcon size={12} />{trendData.trend} from comparison
              </div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
