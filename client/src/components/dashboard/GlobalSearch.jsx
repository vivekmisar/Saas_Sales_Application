import { useState, useEffect } from 'react';
import SearchInput from '../ui/SearchInput';

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
    <SearchInput
      value={localValue}
      onChange={setLocalValue}
      placeholder={placeholder}
      className="w-full sm:w-72"
      ariaLabel="Search report data"
    />
  );
}
