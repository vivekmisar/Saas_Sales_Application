import { Search, X } from 'lucide-react';

export default function SearchInput({ value = '', onChange, placeholder = 'Search…', className = '', inputClassName = '', ariaLabel }) {
  const currentValue = value ?? '';
  return (
    <div className={`app-search-field ${className}`}>
      <Search className="app-search-icon" size={16} aria-hidden="true" />
      <input
        type="search"
        value={currentValue}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
        className={`app-search-control ${inputClassName}`}
      />
      {currentValue && (
        <button
          type="button"
          className="app-search-clear"
          onClick={() => onChange?.('')}
          aria-label="Clear search"
          title="Clear search"
        >
          <X size={15} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
