import { useEffect, useRef, useState } from 'react';
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function parseMonth(value) {
  const match = /^(\d{4})-(\d{2})$/.exec(value || '');
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  return month >= 0 && month < 12 ? { year, month } : null;
}

export default function MonthPicker({ value = '', onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleYear, setVisibleYear] = useState(() => parseMonth(value)?.year ?? new Date().getFullYear());
  const pickerRef = useRef(null);
  const selectedYear = parseMonth(value)?.year;
  const selected = parseMonth(value);
  const today = new Date();

  useEffect(() => {
    if (selectedYear) setVisibleYear(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handlePointerDown = (event) => {
      if (!pickerRef.current?.contains(event.target)) setIsOpen(false);
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

  const displayValue = selected
    ? new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(selected.year, selected.month, 1))
    : label;

  const chooseMonth = (month) => {
    onChange(`${visibleYear}-${String(month + 1).padStart(2, '0')}`);
    setIsOpen(false);
  };

  return (
    <div className="app-month-picker" ref={pickerRef}>
      <button
        type="button"
        className="app-month-trigger"
        aria-label={`${label}${selected ? `, ${displayValue}` : ''}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <CalendarDays size={14} aria-hidden="true" />
        <span className={!selected ? 'is-placeholder' : ''}>{displayValue}</span>
        <ChevronDown size={13} className="app-month-trigger-chevron" aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="app-month-popover" role="dialog" aria-label={`Choose ${label.toLowerCase()}`}>
          <div className="app-month-popover-header">
            <button type="button" onClick={() => setVisibleYear((year) => year - 1)} aria-label="Previous year">
              <ChevronLeft size={16} />
            </button>
            <span>{visibleYear}</span>
            <button type="button" onClick={() => setVisibleYear((year) => year + 1)} aria-label="Next year">
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="app-month-grid">
            {MONTHS.map((month, index) => {
              const isSelected = selected?.year === visibleYear && selected.month === index;
              const isCurrent = today.getFullYear() === visibleYear && today.getMonth() === index;
              return (
                <button
                  type="button"
                  key={month}
                  className={`${isSelected ? 'is-selected' : ''} ${isCurrent ? 'is-current' : ''}`}
                  aria-pressed={isSelected}
                  onClick={() => chooseMonth(index)}
                >
                  {month.slice(0, 3)}
                </button>
              );
            })}
          </div>
          <div className="app-month-popover-footer">
            <button type="button" onClick={() => { onChange(''); setIsOpen(false); }}>Clear</button>
            <button type="button" onClick={() => { onChange(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`); setIsOpen(false); }}>This month</button>
          </div>
        </div>
      )}
    </div>
  );
}
