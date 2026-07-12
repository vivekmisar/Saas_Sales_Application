const statusMap = {
  pending:    'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  processing: 'bg-blue-100  dark:bg-blue-900/30  text-blue-700  dark:text-blue-400',
  completed:  'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  failed:     'bg-red-100   dark:bg-red-900/30   text-red-700   dark:text-red-400',
  active:     'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  archived:   'bg-slate-100  dark:bg-slate-700    text-slate-600  dark:text-slate-400',
};

export default function Badge({ status, className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusMap[status] || 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'} ${className}`}>
      {status}
    </span>
  );
}
