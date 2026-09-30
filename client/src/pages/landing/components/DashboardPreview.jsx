import { ArrowUpRight, BarChart3, ChevronDown, CircleHelp, FileSpreadsheet, LayoutDashboard, Zap } from 'lucide-react';

const PREVIEW_IMAGE = null;

const rows = [
  ['Sample product A', 'Home goods', '$42,800'],
  ['Sample product B', 'Furniture', '$36,250'],
  ['Sample product C', 'Office', '$28,400'],
];

function PreviewChart() {
  return <svg className="l-preview-chart" viewBox="0 0 560 180" role="img" aria-label="Illustrative sample revenue trend chart">
    <title>Illustrative sample revenue trend</title>
    <defs><linearGradient id="preview-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--accent)" stopOpacity=".16"/><stop offset="1" stopColor="var(--accent)" stopOpacity="0"/></linearGradient></defs>
    {[35,75,115,155].map(y=><line key={y} x1="0" y1={y} x2="560" y2={y} stroke="#eeece7" strokeDasharray="3 5"/>)}
    <path d="M0 130 C42 120 55 108 92 112 S153 86 186 96 S242 72 278 80 S335 45 370 61 S422 30 463 45 S525 20 560 23 L560 180 L0 180Z" fill="url(#preview-area)"/>
    <path d="M0 130 C42 120 55 108 92 112 S153 86 186 96 S242 72 278 80 S335 45 370 61 S422 30 463 45 S525 20 560 23" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"/>
    {['Jan','Feb','Mar','Apr','May','Jun','Jul'].map((m,i)=><text key={m} x={i*90+2} y="176" fill="#8a8883" fontSize="10" fontFamily="var(--font-mono-label)">{m}</text>)}
  </svg>;
}

export default function DashboardPreview() {
  if (PREVIEW_IMAGE) return <img className="l-preview-image" src={PREVIEW_IMAGE} loading="eager" width="1440" height="920" alt="SalesIntel dashboard preview"/>;
  return <div className="l-preview-window" aria-label="Illustrative SalesIntel dashboard preview">
    <div className="l-preview-chrome"><span/><span/><span/><b>SalesIntel <i>·</i> Overview</b><div className="l-preview-profile">VM</div></div>
    <div className="l-preview-app">
      <aside className="l-preview-sidebar"><strong><span className="l-preview-logo"><Zap size={13}/></span>SalesIntel</strong><span className="l-preview-workspace">WORKSPACE <ChevronDown size={11}/></span><div className="active"><LayoutDashboard size={14}/> Overview</div><div><BarChart3 size={14}/> Reports</div><div><CircleHelp size={14}/> Projects</div><div><FileSpreadsheet size={14}/> Data</div><div className="l-preview-side-bottom">SAMPLE DASHBOARD</div></aside>
      <div className="l-preview-main"><div className="l-preview-page-title"><div><span>WORKSPACE / SAMPLE PROJECT</span><h3>Sales overview</h3></div><button type="button" aria-label="Sample period menu">Last 6 months <ChevronDown size={12}/></button></div>
        <div className="l-preview-kpis">{[['Total revenue','$248.6k','+12.8%'],['Orders','1,284','+8.2%'],['Win rate','32.4%','+2.1%'],['Growth','14.6%','+4.3%']].map(([label,value,change])=><div key={label}><span>{label}</span><strong>{value}</strong><small><ArrowUpRight size={11}/>{change} <i>sample</i></small></div>)}</div>
        <div className="l-preview-lower"><section className="l-preview-revenue"><div className="l-preview-title"><div><span>REVENUE OVER TIME</span><strong>$248,600 <i>sample</i></strong></div><span>Monthly</span></div><PreviewChart/></section><section className="l-preview-table"><div className="l-preview-title"><div><span>TOP PRODUCTS</span><strong>By revenue</strong></div><span>View all</span></div><div className="l-preview-table-head"><span>PRODUCT</span><span>REVENUE</span></div>{rows.map(([name,category,value])=><div className="l-preview-row" key={name}><div><b>{name}</b><small>{category}</small></div><strong>{value}</strong></div>)}</section></div>
        <div className="l-preview-disclaimer">Illustrative sample data · Values are for design preview only</div>
      </div>
    </div>
  </div>;
}
