import { forwardRef } from 'react';

const Input = forwardRef(function Input({ label, error, icon: Icon, className = '', ...props }, ref) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        )}
        <input
          ref={ref}
          className={`
            w-full rounded-lg border bg-white dark:bg-slate-800
            border-slate-200 dark:border-slate-700
            px-3 py-2.5 text-sm
            text-slate-900 dark:text-slate-100
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            transition-colors duration-200
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Input;
