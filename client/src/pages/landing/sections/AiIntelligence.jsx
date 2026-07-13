import { useEffect, useRef, useState } from 'react';
import { User, Sparkles } from 'lucide-react';

export default function AiIntelligence() {
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const sectionRef = useRef(null);
  
  const fullText = "Electronics generated 48% of revenue. However, Q4 projections indicate Software will surpass this by 12% if current churn rates stabilize.";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isTyping && displayedText === '') {
          setIsTyping(true);
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isTyping, displayedText]);

  useEffect(() => {
    if (isTyping) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 30); // 30ms per character

      return () => clearInterval(interval);
    }
  }, [isTyping, fullText]);

  return (
    <section ref={sectionRef} className="py-32 bg-slate-900 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full max-w-2xl h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium w-fit">
              <Sparkles size={14} /> AI Analyst
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Ask questions. <br/>
              Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">instant answers.</span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed max-w-lg">
              Don't know SQL? No problem. Talk to your data in plain English. Our proprietary AI understands context and returns precise revenue metrics in seconds.
            </p>
          </div>

          {/* Right Chat Interface */}
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl relative">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-violet-500/20 blur-2xl rounded-full" />
            
            <div className="flex flex-col gap-6">
              {/* User Message */}
              <div className="flex gap-4 items-start justify-end">
                <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-5 py-3 shadow-md max-w-[85%] text-sm md:text-base">
                  Which category generated maximum revenue?
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0 border border-slate-600">
                  <User size={18} className="text-slate-300" />
                </div>
              </div>

              {/* AI Message */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div className="bg-slate-700/50 text-slate-200 border border-slate-600/30 rounded-2xl rounded-tl-sm px-5 py-4 shadow-md max-w-[85%] text-sm md:text-base leading-relaxed">
                  {displayedText}
                  {isTyping && <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-400 animate-pulse align-middle" />}
                </div>
              </div>
            </div>

            {/* Faux Input */}
            <div className="mt-8 relative">
              <input 
                type="text" 
                disabled 
                placeholder="Ask SalesIntel..." 
                className="w-full bg-slate-900/50 border border-slate-700 rounded-full px-6 py-3 text-sm text-slate-300 focus:outline-none"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full opacity-80" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
