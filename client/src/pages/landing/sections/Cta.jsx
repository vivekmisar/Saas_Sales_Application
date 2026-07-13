import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function Cta() {
  const bgRef = useRef(null);

  useEffect(() => {
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        backgroundPosition: '200% center',
        ease: 'none',
        duration: 20,
        repeat: -1,
      });
    }
  }, []);

  return (
    <section className="relative py-32 overflow-hidden border-t border-slate-800">
      {/* Animated Background Mesh */}
      <div 
        ref={bgRef}
        className="absolute inset-0 z-0 opacity-40 dark:opacity-20"
        style={{
          background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.4) 0%, rgba(139, 92, 246, 0.2) 30%, transparent 70%)',
          backgroundSize: '200% 200%',
        }}
      />
      
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 z-0 bg-slate-900/80 backdrop-blur-[100px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-[length:200%_auto] animate-gradient">Transform</span> Your Sales Data?
        </h2>
        
        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Join thousands of modern sales teams utilizing AI-driven analytics. 
          No credit card required. Setup in minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-indigo-500/25">
            Start Free <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white">
            Try SalesIntel
          </Button>
        </div>
      </div>
    </section>
  );
}
