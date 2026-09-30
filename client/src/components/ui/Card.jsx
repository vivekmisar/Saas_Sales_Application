import { forwardRef } from 'react';

const Card = forwardRef(function Card({ children, className = '', hover = false, onClick, ...props }, ref) {
  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      ref={ref}
      onClick={onClick}
      data-card-hover={hover ? 'true' : 'false'}
      className={[
        'ui-card relative block w-full text-left',
        'rounded-xl border border-slate-200 dark:border-slate-700',
        'bg-white dark:bg-slate-800',
        'p-5',
        'transition-all duration-300 ease-out',
        hover
          ? 'hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-300 dark:hover:border-indigo-600/50 cursor-pointer'
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
});

export default Card;
