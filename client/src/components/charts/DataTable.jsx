import { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import ChartWrapper from './ChartWrapper';

/**
 * DataTable — Sortable, filterable data table for analytics data.
 *
 * Props:
 *  - title: string — section title
 *  - subtitle: string — optional subtitle
 *  - columns: Array<{ key, label, format? }> — column definitions
 *  - data: Array<Record<string, any>> — rows
 *
 * Features:
 *  - Click column headers to sort (asc/desc/none)
 *  - Text filter across all columns
 *  - Responsive: horizontal scroll on small screens
 */
export default function DataTable({ title, subtitle, columns, data }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [filter, setFilter] = useState('');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const processed = useMemo(() => {
    let rows = [...(data || [])];

    // Filter
    if (filter) {
      const lower = filter.toLowerCase();
      rows = rows.filter((row) =>
        columns.some(({ key }) =>
          String(row[key] ?? '').toLowerCase().includes(lower)
        )
      );
    }

    // Sort
    if (sortKey) {
      rows.sort((a, b) => {
        const aVal = a[sortKey] ?? '';
        const bVal = b[sortKey] ?? '';
        const cmp = typeof aVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }

    return rows;
  }, [data, filter, sortKey, sortDir, columns]);

  if (!data || data.length === 0) return null;

  const SortIcon = ({ colKey }) => {
    if (sortKey !== colKey) return <ArrowUpDown size={12} className="text-slate-400" />;
    return sortDir === 'asc'
      ? <ArrowUp size={12} className="app-accent-icon" />
      : <ArrowDown size={12} className="app-accent-icon" />;
  };

  return (
    <ChartWrapper title={title} subtitle={subtitle}>
      {/* Filter */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="app-table-search w-full sm:w-64 px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50">
              {columns.map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors select-none"
                >
                  <span className="inline-flex items-center gap-1.5">
                    {label}
                    <SortIcon colKey={key} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {processed.map((row, i) => (
              <tr
                key={i}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {columns.map(({ key, format }) => (
                  <td
                    key={key}
                    className="px-4 py-2.5 text-slate-700 dark:text-slate-300 whitespace-nowrap"
                  >
                    {format ? format(row[key]) : row[key]}
                  </td>
                ))}
              </tr>
            ))}
            {processed.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-slate-400"
                >
                  No matching rows
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </ChartWrapper>
  );
}
