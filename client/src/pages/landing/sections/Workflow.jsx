import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileSpreadsheet, Cpu, BarChart2, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Workflow() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  
  // Elements
  const titleRef = useRef(null);
  const csvRef = useRef(null);
  const engineRef = useRef(null);
  const aiTextRef = useRef(null);
  const dashboardRef = useRef(null);
  const dataParticlesRef = useRef([]);

  useEffect(() => {
    // Media query to check if we are on a desktop (enable full scrolljacking)
    // On mobile, we might simplify, but for now we'll scale elements down via CSS and keep timeline.
    const ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=4000", // 4000px of scrolling for the story
          scrub: 1, // Smooth scrubbing
          pin: stickyRef.current,
          anticipatePin: 1,
        }
      });

      // --- PHASE 1: Introduction & CSV Upload ---
      
      // Title fades up and slightly away
      tl.to(titleRef.current, { opacity: 0.2, scale: 0.9, y: -50, duration: 1 })
      
      // CSV Card enters from bottom
      .fromTo(csvRef.current, 
        { y: '100vh', opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 2, ease: "power2.out" },
        "<0.5"
      )

      // --- PHASE 2: Cleaning Data ---
      
      // Select the faux rows inside the CSV
      const rows = csvRef.current.querySelectorAll('.csv-row');
      // Highlight rows, turn red lines green (simulating cleaning)
      tl.to(rows, { 
        backgroundColor: 'rgba(16, 185, 129, 0.2)', // emerald-500/20
        borderColor: 'rgba(16, 185, 129, 0.5)',
        stagger: 0.2, 
        duration: 1 
      })
      // Shrink CSV slightly to make room
      .to(csvRef.current, { scale: 0.7, x: '-25vw', duration: 1.5, ease: "power2.inOut" })

      // --- PHASE 3: Analytics Engine ---
      
      // Engine appears in the center
      .fromTo(engineRef.current,
        { opacity: 0, scale: 0, rotation: -90 },
        { opacity: 1, scale: 1, rotation: 0, duration: 1.5, ease: "back.out(1.7)" },
        "<"
      )
      
      // Particles (Data) flow from CSV to Engine
      .fromTo(dataParticlesRef.current,
        { x: '-25vw', y: 0, opacity: 0 },
        { 
          x: 0, 
          y: 0, 
          opacity: 1, 
          stagger: 0.1, 
          duration: 1,
          ease: "power1.inOut",
          onComplete: function() {
            gsap.to(this.targets(), { opacity: 0, duration: 0.2 }); // Disappear into engine
          }
        },
        "-=0.5"
      )
      
      // Engine pulses
      .to(engineRef.current, { scale: 1.1, duration: 0.5, yoyo: true, repeat: 3 }, "<")

      // AI Text typing simulation (using simple width/opacity reveal)
      .fromTo(aiTextRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 2, ease: "none" }
      )

      // --- PHASE 4: Dashboard Buildout ---
      
      // CSV disappears, Engine shifts left, AI text fades
      .to([csvRef.current, aiTextRef.current], { opacity: 0, duration: 1 })
      .to(engineRef.current, { scale: 0.5, x: '-35vw', opacity: 0.5, duration: 1.5, ease: "power2.inOut" }, "<")
      
      // Dashboard container enters from right
      .fromTo(dashboardRef.current,
        { x: '50vw', opacity: 0, scale: 0.9 },
        { x: '10vw', opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" },
        "<0.5"
      )
      
      // Dashboard internal elements grow/appear
      const dashCards = dashboardRef.current.querySelectorAll('.dash-card');
      const dashBars = dashboardRef.current.querySelectorAll('.dash-bar');
      
      tl.fromTo(dashCards,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: "back.out(1.5)" }
      )
      .fromTo(dashBars,
        { scaleY: 0, transformOrigin: "bottom" },
        { scaleY: 1, stagger: 0.1, duration: 1.5, ease: "elastic.out(1, 0.5)" },
        "<0.5"
      );

    }, sectionRef);

    return () => ctx.revert(); // Cleanup GSAP context
  }, []);

  // Helper to push particle refs
  const addToParticles = (el) => {
    if (el && !dataParticlesRef.current.includes(el)) {
      dataParticlesRef.current.push(el);
    }
  };

  return (
    <section ref={sectionRef} className="relative bg-slate-900 overflow-visible z-10" style={{ height: '500vh' }}>
      {/* Sticky Container */}
      <div ref={stickyRef} className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center bg-slate-900 border-y border-slate-800">
        
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-[0.02]" 
          style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} 
        />

        {/* Global Title */}
        <div ref={titleRef} className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-50">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            The Workflow
          </h2>
          <p className="text-xl text-slate-400">Scroll to see how your data transforms.</p>
        </div>

        {/* --- SCENE ELEMENTS --- */}

        {/* 1. CSV Card */}
        <div ref={csvRef} className="absolute w-72 md:w-96 bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-6 flex flex-col gap-4 z-20 opacity-0">
          <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><FileSpreadsheet size={24} /></div>
            <div>
              <div className="text-white font-medium">sales_q3_raw.csv</div>
              <div className="text-xs text-slate-400">2.4 MB • 15,243 rows</div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`csv-row h-6 rounded border flex items-center px-2 gap-2 transition-colors ${i % 2 === 0 ? 'bg-rose-500/10 border-rose-500/30' : 'bg-slate-700/50 border-slate-600/50'}`}>
                <div className="w-4 h-1 bg-current opacity-30 rounded" />
                <div className="w-12 h-1 bg-current opacity-30 rounded" />
                <div className="w-8 h-1 bg-current opacity-30 rounded" />
                <div className="w-full h-1 bg-current opacity-30 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* 2. Data Particles (Flying from CSV to Engine) */}
        <div className="absolute z-30 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              ref={addToParticles}
              className="absolute w-3 h-3 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(129,140,248,0.8)] opacity-0"
              style={{ 
                top: `${(Math.random() - 0.5) * 100}px`, 
                left: `${(Math.random() - 0.5) * 100}px` 
              }}
            />
          ))}
        </div>

        {/* 3. Analytics Engine */}
        <div className="absolute z-20 flex flex-col items-center">
          <div ref={engineRef} className="w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-800 flex items-center justify-center border-4 border-slate-900 shadow-[0_0_40px_rgba(99,102,241,0.4)] opacity-0 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-50" />
            <Cpu size={48} className="text-white animate-pulse" />
          </div>
          <div ref={aiTextRef} className="mt-8 text-center opacity-100" style={{ clipPath: 'inset(0 100% 0 0)' }}>
            <div className="text-emerald-400 font-mono text-sm mb-1 flex items-center justify-center gap-2">
              <CheckCircle2 size={14} /> Processing complete
            </div>
            <div className="text-white text-lg font-medium">99.8% anomalies resolved</div>
          </div>
        </div>

        {/* 4. Dashboard Mockup Assembly */}
        <div ref={dashboardRef} className="absolute w-[80vw] max-w-2xl bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-6 z-40 opacity-0 overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <BarChart2 size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-xl">Revenue Insights</div>
              <div className="text-slate-400 text-sm">Updated just now</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="dash-card bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 opacity-0">
              <div className="text-slate-400 text-xs font-medium mb-1">Total Revenue</div>
              <div className="text-2xl font-bold text-white">$124,500</div>
              <div className="text-emerald-400 text-xs mt-2">↑ 14.2% from last month</div>
            </div>
            <div className="dash-card bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 opacity-0">
              <div className="text-slate-400 text-xs font-medium mb-1">Win Rate</div>
              <div className="text-2xl font-bold text-white">68.4%</div>
              <div className="text-emerald-400 text-xs mt-2">↑ 5.1% from last month</div>
            </div>
          </div>

          <div className="dash-card h-48 bg-slate-900/50 rounded-xl border border-slate-700/50 p-4 flex items-end gap-2 opacity-0">
            {[40, 65, 45, 80, 55, 90, 75, 110, 85].map((h, i) => (
              <div key={i} className="flex-1 h-full flex items-end">
                <div 
                  className="dash-bar w-full bg-gradient-to-t from-indigo-600 to-violet-400 rounded-t-sm opacity-80"
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
