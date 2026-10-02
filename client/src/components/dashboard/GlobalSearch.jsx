import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function GlobalSearch({ value, onChange, placeholder = 'Search...' }) {
  const [localValue, setLocalValue] = useState(value || '');

  // Sync prop changes (e.g. clear filters) to local state
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  // Debounce the search input to avoid re-rendering heavy charts on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(localValue);
    }, 300);
    return () => clearTimeout(handler);
  }, [localValue, onChange]);

  return (
    <div className="relative w-full sm:w-72">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={16} className="text-slate-400" />
      </div>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="app-search-input block w-full pl-10 pr-10 py-2 sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition-colors shadow-sm"
      />
      {localValue && (
        <button
          onClick={() => setLocalValue('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
