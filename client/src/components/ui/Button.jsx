import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-black text-white hover:bg-neutral-800 shadow-sm',
  secondary: 'bg-transparent text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800',
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
      className={`ui-button ui-button-${variant} inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 ease-out active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
