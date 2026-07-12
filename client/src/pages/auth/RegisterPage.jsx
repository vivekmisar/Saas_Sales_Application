import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, User, Zap } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import gsap from 'gsap';

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    gsap.fromTo(formRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding */}
      <div className="hidden lg:flex lg:w-[55%] bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-32 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-md text-white">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-8">
            <Zap size={28} />
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Start making smarter sales decisions today
          </h1>
          <p className="text-lg text-violet-200 leading-relaxed">
            Join teams using AI-powered analytics to understand their sales data and drive growth.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
        <div ref={formRef} className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-heading)' }}>SalesIntel</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Create your account</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Get started in under a minute</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" name="name" placeholder="John Doe" icon={User} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Email" name="email" type="email" placeholder="you@company.com" icon={Mail} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Password" name="password" type="password" placeholder="Minimum 8 characters" icon={Lock} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
            <Button type="submit" loading={loading} className="w-full" size="lg">Create Account</Button>
          </form>

          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-500 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
