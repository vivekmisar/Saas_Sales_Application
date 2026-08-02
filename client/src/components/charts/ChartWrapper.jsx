import { useState, useRef, useEffect, forwardRef } from 'react';
import Card from '../ui/Card';
import { Maximize2, Minimize2, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

/**
 * ChartWrapper — consistent container for all chart components.
 */
export default function ChartWrapper({ title, subtitle, children, className = '' }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const wrapperRef = useRef(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      wrapperRef.current?.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  // Sync state with native ESC key fullscreen exit via proper useEffect
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const downloadChart = async () => {
    if (!wrapperRef.current) return;
    try {
      const canvas = await html2canvas(wrapperRef.current, {
        scale: 2,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#1e293b' : '#ffffff'
      });
      const link = document.createElement('a');
      link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-chart.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to download chart image', error);
    }
  };

  return (
    <Card 
      className={`group animate-fade-in ${className} ${isFullscreen ? 'fixed inset-0 z-[100] m-0 rounded-none w-screen h-screen flex flex-col' : ''}`}
      ref={wrapperRef}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-heading font-semibold text-slate-800 dark:text-slate-200">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={downloadChart}
            className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-md transition-colors"
            title="Download Chart Image"
          >
            <Download size={16} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-md transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>
      <div className={isFullscreen ? 'flex-1 min-h-0' : ''}>
        {children}
      </div>
    </Card>
  );
}
