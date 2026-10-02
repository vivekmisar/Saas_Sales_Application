import { DollarSign, ShoppingCart, Users, TrendingUp, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import AnimatedNumber from '../ui/AnimatedNumber';
import { formatCurrency, formatNumber } from '../../lib/formatters';

/**
 * KpiCards — top-level KPI stat cards.
 *
 * Renders 5 cards in a responsive grid:
 *   - Total Revenue
 *   - Total Orders
 *   - Total Customers
 *   - Average Order Value
 *   - Total Profit
 *
 * All values come from the analytics JSON — nothing is hardcoded.
 */

const kpiConfig = [
  {
    key: 'total_revenue',
    label: 'Total Revenue',
    icon: DollarSign,
    format: formatCurrency,
    bgLight: 'app-kpi-icon-wrap',
    textColor: 'app-kpi-icon',
  },
  {
    key: 'total_orders',
    label: 'Total Orders',
    icon: ShoppingCart,
    format: formatNumber,
    bgLight: 'app-kpi-icon-wrap',
    textColor: 'app-kpi-icon',
  },
  {
    key: 'total_customers',
    label: 'Customers',
    icon: Users,
    format: formatNumber,
    bgLight: 'app-kpi-icon-wrap',
    textColor: 'app-kpi-icon',
  },
  {
    key: 'average_order_value',
    label: 'Avg. Order Value',
    icon: TrendingUp,
    format: formatCurrency,
    bgLight: 'app-kpi-icon-wrap',
    textColor: 'app-kpi-icon',
  },
  {
    key: 'total_profit',
    label: 'Total Profit',
    icon: PiggyBank,
    format: formatCurrency,
    prefix: '$',
    bgLight: 'app-kpi-icon-wrap',
    textColor: 'app-kpi-icon',
  },
];

export default function KpiCards({ analytics, compareAnalytics }) {
  if (!analytics) return null;

  // Calculate actual trend if compareAnalytics is provided
  const getTrendData = (key, value) => {
    if (!compareAnalytics || compareAnalytics[key] === undefined) {
      return null;
    }
    
    const compareValue = compareAnalytics[key];
    if (compareValue === 0) return { trend: '—', isPositive: true };

    const diff = value - compareValue;
    const growth = (diff / compareValue) * 100;
    const isPositive = growth >= 0;
    
    return {
      trend: `${isPositive ? '+' : ''}${growth.toFixed(1)}%`,
      isPositive,
    };
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {kpiConfig.map(({ key, label, icon: Icon, format, bgLight, textColor }, i) => {
        const value = analytics[key] ?? 0;
        const trendData = getTrendData(key, value);
        const TrendIcon = trendData?.isPositive ? ArrowUpRight : ArrowDownRight;
        const trendColor = trendData?.isPositive ? 'text-emerald-600' : 'text-rose-500';
        
        return (
          <div
            key={key}
            className="app-kpi-card relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 transition-all duration-300 hover:-translate-y-0.5 animate-fade-in flex flex-col justify-between"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg ${bgLight} flex items-center justify-center relative z-10`}>
                  <Icon size={18} className={textColor} />
                </div>
                {trendData && <div className={`app-kpi-trend flex items-center gap-1 text-xs font-medium ${trendColor} bg-slate-50 dark:bg-slate-900/50 px-2 py-1 rounded-full relative z-10`} title="Change from the selected comparison report">
                  <TrendIcon size={12} />{trendData.trend}
                </div>}
              </div>
              <p className="text-xl font-heading font-bold text-slate-900 dark:text-white relative z-10">
                <AnimatedNumber
                  value={value}
                  format={format}
                />
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 relative z-10">{label}</p>
            </div>
            
          </div>
        );
      })}
    </div>
  );
}
