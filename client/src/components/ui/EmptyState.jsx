import { useEffect, useRef } from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';
import gsap from 'gsap';

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', description = '', actionLabel, onAction }) {
  const iconRef = useRef(null);

  useEffect(() => {
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        y: -6,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div 
        ref={iconRef}
        className="app-empty-icon rounded-2xl p-4 mb-5"
      >
        <Icon size={32} />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
        {title}
      </h3>
      {description && <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-5 leading-relaxed">{description}</p>}
      {actionLabel && onAction && <Button onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
}
