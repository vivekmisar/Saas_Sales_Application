import { Server, Database, Code2, LineChart, ShieldCheck, Palette, Zap, Box, Terminal, Cpu } from 'lucide-react';

const TECH_STACK = [
  { name: 'React', icon: Code2, color: 'text-cyan-400', bgHover: 'hover:border-cyan-500/50' },
  { name: 'Express.js', icon: Server, color: 'text-slate-400', bgHover: 'hover:border-slate-400/50' },
  { name: 'MongoDB', icon: Database, color: 'text-emerald-500', bgHover: 'hover:border-emerald-500/50' },
  { name: 'FastAPI', icon: Zap, color: 'text-teal-400', bgHover: 'hover:border-teal-500/50' },
  { name: 'Pandas', icon: Box, color: 'text-blue-500', bgHover: 'hover:border-blue-500/50' },
  { name: 'NumPy', icon: Cpu, color: 'text-indigo-400', bgHover: 'hover:border-indigo-500/50' },
  { name: 'Apache ECharts', icon: LineChart, color: 'text-rose-400', bgHover: 'hover:border-rose-500/50' },
  { name: 'Passport.js', icon: ShieldCheck, color: 'text-green-400', bgHover: 'hover:border-green-500/50' },
  { name: 'TailwindCSS', icon: Palette, color: 'text-sky-400', bgHover: 'hover:border-sky-500/50' },
  { name: 'GSAP', icon: Terminal, color: 'text-green-500', bgHover: 'hover:border-green-500/50' },
];

export default function TechStack() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Built on a modern stack
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Enterprise-grade technologies ensuring scale, security, and speed.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {TECH_STACK.map((tech, i) => {
            const Icon = tech.icon;
            return (
              <div 
                key={i}
                className={`group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${tech.bgHover}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 ${tech.color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {tech.name}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
