import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Menu, X } from 'lucide-react';
import { useScroll } from '../hooks/useScroll';
import Button from '../../../components/ui/Button';
import gsap from 'gsap';
import { useState } from 'react';

export default function LandingNavbar() {
  const scrolled = useScroll(20);
  const navRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (scrolled) {
      gsap.to(navRef.current, {
        backgroundColor: 'rgba(15, 23, 42, 0.8)', // slate-900 with opacity
        backdropFilter: 'blur(12px)',
        borderBottomColor: 'rgba(51, 65, 85, 0.5)', // slate-700
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
        duration: 0.3,
        ease: 'power2.out'
      });
    } else {
      gsap.to(navRef.current, {
        backgroundColor: 'rgba(15, 23, 42, 0)',
        backdropFilter: 'blur(0px)',
        borderBottomColor: 'rgba(51, 65, 85, 0)',
        paddingTop: '1rem',
        paddingBottom: '1rem',
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [scrolled]);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Github', href: 'https://github.com', external: true },
  ];

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 border-b border-transparent transition-all"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center transition-transform group-hover:scale-105">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-heading)' }}>
            SalesIntel
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
              >
                {link.label}
              </a>
            )
          ))}
        </nav>

        {/* Right Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login">
            <Button variant="primary">Try Now</Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-slate-600 dark:text-slate-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 shadow-xl flex flex-col gap-4">
          {navLinks.map((link) => (
             link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-lg font-medium text-slate-800 dark:text-slate-100 py-2 border-b border-slate-100 dark:border-slate-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
             ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-lg font-medium text-slate-800 dark:text-slate-100 py-2 border-b border-slate-100 dark:border-slate-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
             )
          ))}
          <div className="mt-4">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full justify-center">Try Now</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
