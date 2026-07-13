import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LandingNavbar from './components/LandingNavbar';
import Button from '../../components/ui/Button';
import Hero from './sections/Hero';
import Workflow from './sections/Workflow';
import Features from './sections/Features';
import DashboardShowcase from './sections/DashboardShowcase';
import AiIntelligence from './sections/AiIntelligence';
import Faq from './sections/Faq';
import Cta from './sections/Cta';
import Footer from './sections/Footer';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) return null; // Avoid rendering flash while redirecting

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-sans selection:bg-indigo-500/30">
      <LandingNavbar />
      
      <main>
        {/* Hero Section */}
        <Hero />


        <Workflow />

        <Features />
        <DashboardShowcase />
        <AiIntelligence />
        <Faq />
      </main>

      <Cta />
      <Footer />
    </div>
  );
}
