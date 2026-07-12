import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm shadow-indigo-500/20',
  secondary: 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600',
  ghost:  'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200',
  danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-500/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
};

export default function Button({ children, variant = 'primary', size = 'md', loading = false, disabled = false, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
