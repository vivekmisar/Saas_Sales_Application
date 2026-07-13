export default function Card({ children, className = '', hover = false, onClick, ...props }) {
  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      onClick={onClick}
      className={[
        'relative block w-full text-left',
        'rounded-xl border border-slate-200 dark:border-slate-700',
        'bg-white dark:bg-slate-800',
        'p-5',
        'transition-all duration-200',
        hover
          ? 'hover:shadow-md hover:shadow-indigo-500/5 hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </Tag>
  );
}
