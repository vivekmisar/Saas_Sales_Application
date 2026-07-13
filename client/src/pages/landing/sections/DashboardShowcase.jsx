import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CheckCircle2 } from 'lucide-react';
import dashboardImg from '../../../assets/dashboard-preview.png';

export default function DashboardShowcase() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    // 1. Continuous Float Animation
    let floatTween;
    if (containerRef.current) {
      floatTween = gsap.to(containerRef.current, {
        y: '+=20',
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
    }

    // 2. Mouse Parallax Tilt
    const handleMouseMove = (e) => {
      if (!containerRef.current || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      // Calculate mouse position relative to the section center (-1 to 1)
      const xPos = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const yPos = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      gsap.to(containerRef.current, {
        rotationY: xPos * 8, // subtle 8 degree max tilt
        rotationX: yPos * -8,
        duration: 1,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      if (!containerRef.current) return;
      gsap.to(containerRef.current, {
        rotationY: 0,
        rotationX: 0,
        duration: 1,
        ease: 'power2.out'
      });
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      section.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (floatTween) floatTween.kill();
      if (section) {
        section.removeEventListener('mousemove', handleMouseMove);
        section.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-32 bg-slate-50 dark:bg-slate-950 overflow-hidden relative perspective-[1200px]">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content (Capabilities) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-6">
                Real-Time Intelligence
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Your entire business, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">at a glance.</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                The SalesIntel dashboard is engineered for clarity and speed. Stop hunting for metrics across spreadsheets and experience unified, interactive analytics.
              </p>
            </div>

            <ul className="flex flex-col gap-4">
              {[
                "Live Revenue Tracking & Goal Pacing",
                "Automated Churn Risk Detection",
                "Interactive Geography & Product Filters",
                "One-Click CSV Exports for Stakeholders"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="text-emerald-500 mt-0.5 shrink-0" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Content (Showcase Image) */}
          <div className="lg:col-span-7 relative transform-style-3d">
            <div ref={containerRef} className="relative w-full rounded-2xl p-2 bg-white/10 dark:bg-slate-800/20 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-[0_0_50px_rgba(99,102,241,0.2)]">
              {/* The "Real" Dashboard Screenshot */}
              <img 
                ref={imageRef}
                src={dashboardImg} 
                alt="SalesIntel Dashboard Preview" 
                className="w-full h-auto rounded-xl shadow-2xl object-cover"
                style={{ aspectRatio: '16/9' }}
              />
              
              {/* Glassmorphic Overlay Highlights */}
              <div className="absolute top-0 left-0 w-full h-full rounded-2xl bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
