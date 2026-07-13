import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Button from '../../../components/ui/Button';
import ParticleBackground from '../components/ParticleBackground';
import DashboardMockup from '../components/DashboardMockup';
import { Play } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const textContainerRef = useRef(null);
  const mockupRef = useRef(null);

  useEffect(() => {
    // 1. Entrance Animations
    const tl = gsap.timeline();
    
    // Animate text elements stagger
    if (textContainerRef.current) {
      const children = textContainerRef.current.children;
      tl.fromTo(
        children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
      );
    }

    // Animate mockup floating in
    if (mockupRef.current) {
      tl.fromTo(
        mockupRef.current,
        { opacity: 0, x: 40, rotationY: -15, rotationX: 10 },
        { opacity: 1, x: 0, rotationY: -5, rotationX: 5, duration: 1.2, ease: 'power2.out' },
        '-=0.8'
      );
    }

    // 2. Continuous Floating Effect for mockup
    let floatTween;
    if (mockupRef.current) {
      floatTween = gsap.to(mockupRef.current, {
        y: '+=15',
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
    }

    // 3. Mouse Parallax
    const handleMouseMove = (e) => {
      if (!mockupRef.current) return;
      const { innerWidth, innerHeight } = window;
      const xPos = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const yPos = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1

      gsap.to(mockupRef.current, {
        rotationY: -5 + xPos * 10,
        rotationX: 5 + yPos * -10,
        x: xPos * -20,
        y: yPos * -20,
        duration: 1,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      if (!mockupRef.current) return;
      gsap.to(mockupRef.current, {
        rotationY: -5,
        rotationX: 5,
        x: 0,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      });
    };

    const container = heroRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (floatTween) floatTween.kill();
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-[90vh] flex items-center perspective-[1000px]">
      
      {/* Background Visuals */}
      <div className="absolute inset-0 z-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
        
        {/* Soft Grid */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
          style={{ backgroundImage: 'linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
        
        {/* Animated Gradient Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] opacity-40 dark:opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[128px] animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[128px] animate-blob animation-delay-2000" />
        </div>

        {/* Canvas Particles */}
        <ParticleBackground />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Content */}
          <div ref={textContainerRef} className="text-center lg:text-left pt-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Sales Intelligence Platform
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              Transform Raw <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">Sales Data</span> Into <br className="hidden lg:block" />
              Business Intelligence.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Upload your CSV files, get instant AI-powered analytics, and make data-driven decisions that accelerate your revenue growth instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-base px-8 py-3.5 shadow-lg shadow-indigo-500/25" onClick={() => navigate('/login')}>
                Try Now
              </Button>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base px-8 py-3.5 flex items-center justify-center gap-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50" onClick={() => {}}>
                <Play size={18} />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Right Column: Visual Mockup */}
          <div className="relative hidden md:block w-full max-w-xl mx-auto transform-gpu" style={{ perspective: '1200px' }}>
            <div ref={mockupRef} className="transform-style-3d">
              {/* Glow underneath */}
              <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full transform -translate-z-10" />
              <DashboardMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
