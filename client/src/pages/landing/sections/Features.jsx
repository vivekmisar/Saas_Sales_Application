import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LayoutDashboard, FileSpreadsheet, Brain, TrendingUp, Globe, Users, Package, Download, ShieldCheck, Smartphone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  { icon: LayoutDashboard, title: 'Interactive Dashboard', desc: 'Real-time metrics and dynamic data visualization.' },
  { icon: FileSpreadsheet, title: 'CSV Analysis', desc: 'Drag-and-drop raw data processing with instant cleaning.' },
  { icon: Brain, title: 'AI Insights', desc: 'Automated trend detection and smart summaries.' },
  { icon: TrendingUp, title: 'Forecasting', desc: 'Predictive revenue modeling and future projections.' },
  { icon: Globe, title: 'Regional Analytics', desc: 'Break down performance by geography and market.' },
  { icon: Users, title: 'Customer Analytics', desc: 'Deep dive into user behavior, churn, and retention.' },
  { icon: Package, title: 'Product Analytics', desc: 'Track specific SKU performance and margins.' },
  { icon: Download, title: 'Export Reports', desc: 'Generate PDF/CSV reports for stakeholders instantly.' },
  { icon: ShieldCheck, title: 'Authentication', desc: 'Enterprise-grade security and session management.' },
  { icon: Smartphone, title: 'Responsive Design', desc: 'Access your intelligence platform from any device.' },
];

export default function Features() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        // Alternate animation directions based on index (even = left, odd = right)
        const xOffset = i % 2 === 0 ? -50 : 50;

        gsap.fromTo(
          card,
          { opacity: 0, x: xOffset, y: 30 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%', // Trigger when the top of the card hits 85% down the viewport
              toggleActions: 'play none none reverse', // Reverse animation if scrolled back up
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <section ref={sectionRef} id="features" className="py-32 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-heading)' }}>
            Everything you need to <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">scale</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            A comprehensive suite of tools designed specifically for modern sales teams. 
            No complex setup, just upload and unlock growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {FEATURES.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div 
                key={index} 
                ref={addToRefs}
                className="group relative bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 hover:border-indigo-500/50 transition-colors duration-300"
              >
                {/* Subtle hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
