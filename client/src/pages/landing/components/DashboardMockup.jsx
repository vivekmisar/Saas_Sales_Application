import { BarChart, Activity, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function DashboardMockup() {
  return (
    <div className="w-full h-auto bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl shadow-indigo-500/20 overflow-hidden flex flex-col pointer-events-none select-none">
      {/* Mockup Header */}
      <div className="h-12 border-b border-slate-800 flex items-center px-4 justify-between bg-slate-900/80 backdrop-blur-sm">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="text-xs font-medium text-slate-500">app.salesintel.com</div>
        <div className="w-4 h-4" /> {/* Spacer for symmetry */}
      </div>

      {/* Mockup Content */}
      <div className="p-6 flex-1 bg-slate-900 flex flex-col gap-6">
        {/* Top metrics row */}
        <div className="grid grid-cols-3 gap-4">
          <MetricCard title="Total Revenue" value="$124,500" trend="+14.2%" positive icon={<Activity size={16} />} />
          <MetricCard title="Active Users" value="1,432" trend="+5.4%" positive icon={<Users size={16} />} />
          <MetricCard title="Churn Rate" value="1.2%" trend="-0.4%" positive icon={<BarChart size={16} />} />
        </div>

        {/* Main Chart Area */}
        <div className="flex-1 rounded-xl bg-slate-800/50 border border-slate-700/50 p-4 relative overflow-hidden min-h-[200px]">
          <div className="text-sm font-medium text-slate-400 mb-6">Revenue Overview</div>
          {/* Faux Chart Lines */}
          <div className="absolute bottom-4 left-4 right-4 h-32 flex items-end justify-between gap-2">
            {[40, 60, 45, 80, 55, 90, 75, 110, 85, 120, 95, 130].map((height, i) => (
              <div 
                key={i} 
                className="w-full bg-indigo-500/20 rounded-t-sm relative group"
                style={{ height: `${height}%` }}
              >
                <div 
                  className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-indigo-600/80 to-violet-400/80 rounded-t-sm opacity-50"
                  style={{ height: `${height * 0.8}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, positive, icon }) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex flex-col gap-2">
      <div className="flex items-center justify-between text-slate-400">
        <span className="text-xs font-medium">{title}</span>
        {icon}
      </div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className={`text-xs font-medium flex items-center gap-1 ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
        {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {trend}
      </div>
    </div>
  );
}
