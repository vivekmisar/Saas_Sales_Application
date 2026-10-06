import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FilterSelect({ icon: Icon, value = '', onChange, options, emptyLabel, ariaLabel }) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const selectedLabel = value || emptyLabel;

  useEffect(() => {
    if (!isOpen) return undefined;
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const choices = [{ label: emptyLabel, value: '' }, ...options.map((option) => ({ label: option, value: option }))];

  return (
    <div className="app-filter-select app-filter-dropdown" ref={rootRef}>
      <button
        type="button"
        className="app-filter-dropdown-trigger"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {Icon && <Icon size={14} aria-hidden="true" />}
        <span>{selectedLabel}</span>
        <ChevronDown size={14} className="app-filter-dropdown-chevron" aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="app-filter-dropdown-menu" role="listbox" aria-label={ariaLabel}>
          {choices.map((choice) => (
            <button
              type="button"
              key={choice.value || 'all'}
              role="option"
              aria-selected={value === choice.value}
              className={value === choice.value ? 'is-selected' : ''}
              onClick={() => { onChange(choice.value); setIsOpen(false); }}
            >
              {choice.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
