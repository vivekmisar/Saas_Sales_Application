import React from 'react';
import DonutChart from './DonutChart';

/** Revenue share by category from analytics.category_revenue[]. */
const CategoryDistributionChart = React.memo(function CategoryDistributionChart({ data, onDrillDown }) {
  const safeData = Array.isArray(data) ? data : [];
  const chartData = safeData.map((item) => ({
    category: item?.category,
    revenue: item?.revenue,
  }));

  return (
    <DonutChart
      title="Category Distribution"
      subtitle="Revenue share by category"
      data={chartData}
      nameKey="category"
      valueKey="revenue"
      onDrillDown={onDrillDown}
    />
  );
});

export default CategoryDistributionChart;
