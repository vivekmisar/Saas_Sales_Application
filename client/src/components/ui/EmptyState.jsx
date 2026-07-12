import { Inbox } from 'lucide-react';
import Button from './Button';

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', description = '', actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950 p-4 mb-4">
        <Icon size={32} className="text-indigo-500 dark:text-indigo-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
        {title}
      </h3>
      {description && <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-4">{description}</p>}
      {actionLabel && onAction && <Button onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
}
