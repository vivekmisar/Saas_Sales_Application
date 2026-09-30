import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ArrowDownRight, ArrowRight, BarChart3, Check, CircleHelp, Database, Download, FileSpreadsheet, Globe, Menu, Minus, Plus, Shield, Sparkles, TrendingUp, Users, X, Zap } from 'lucide-react';
import { useState, useRef } from 'react';
import DashboardPreview from './components/DashboardPreview';
import './landing.css';

const faqItems = [
  { q: 'What kind of CSV files can I use?', a: <>SalesIntel accepts CSV files. The analysis looks for sales fields such as revenue, product, category, region, and customer; some fields are optional. <span className="l-todo">{/* TODO: verify supported column aliases and required fields before publishing. */}</span></> },
  { q: 'How is my data secured?', a: <>Projects and reports are accessed through authenticated routes. For details about storage, encryption, and retention, please contact the team. <span className="l-todo">{/* TODO: verify infrastructure security and retention practices. */}</span></> },
  { q: 'Can I export my results?', a: <>The dashboard includes PDF, Excel, and CSV export options for reports and analytics.</> },
  { q: 'Is there a file size limit?', a: <>The limit depends on the current deployment. Check with the team before uploading a large file. <span className="l-todo">{/* TODO: verify the configured upload limit. */}</span></> },
  { q: 'What do the AI insights include?', a: <>SalesIntel surfaces calculated sales metrics and visual breakdowns. The answers shown here use sample data; verify AI availability for your deployment. <span className="l-todo">{/* TODO: verify AI insight availability and scope; current analytics engine exposes calculated metrics. */}</span></> },
  { q: 'How accurate are the forecasts?', a: <>Forecast availability and accuracy depend on the analysis features enabled for your deployment. We do not promise a specific level of accuracy. <span className="l-todo">{/* TODO: verify forecasting implementation; avoid accuracy promises. */}</span></> },
];

function Eyebrow({ children, dot = false }) { return <div className="l-eyebrow">{dot && <i aria-hidden="true" />}{children}</div>; }
function SectionHeading({ label, children, id }) { return <div className="l-section-heading"><Eyebrow>{label}</Eyebrow><h2 id={id}>{children}</h2></div>; }
function PrimaryLink({ children = 'Try the demo', className = '' }) { return <Link className={`l-button ${className}`} to="/login">{children}<ArrowRight size={16} aria-hidden="true" /></Link>; }

function LNav() {
  const [open, setOpen] = useState(false);
  const nav = [{ label: 'Features', href: '#features' }, { label: 'How it works', href: '#how-it-works' }, { label: 'FAQ', href: '#faq' }];
  return <header className="l-nav-wrap"><nav className="l-nav" aria-label="Main navigation">
    <Link className="l-brand" to="/" aria-label="SalesIntel home"><span className="l-brand-mark"><Zap size={17} strokeWidth={1.7} /></span><span>SalesIntel</span></Link>
    <div className="l-nav-links">{nav.map(n => <a key={n.href} href={n.href}>{n.label}</a>)}<a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></div>
    <PrimaryLink className="l-nav-cta" />
    <button className="l-menu-button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="landing-menu" onClick={() => setOpen(!open)}>{open ? <X size={19} /> : <Menu size={19} />}</button>
    {open && <div className="l-mobile-menu" id="landing-menu">{nav.map(n => <a key={n.href} href={n.href} onClick={() => setOpen(false)}>{n.label}</a>)}<a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a><PrimaryLink /></div>}
  </nav></header>;
}

function CountValue({ end, format, active }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) { setValue(0); return undefined; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setValue(end); return undefined; }
    let frame; let start;
    const animate = (time) => {
      if (start === undefined) start = time;
      const progress = Math.min((time - start) / 1200, 1);
      setValue(Math.round(end * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [active, end]);
  return format(value);
}

function Demo() {
  const [state, setState] = useState('idle');
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const run = () => { if (state === 'running') return; setState('running'); timer.current = setTimeout(() => setState('done'), 1500); };
  const reset = () => { clearTimeout(timer.current); setState('idle'); };
  return <div className="l-demo-card">
    <div className="l-demo-top"><div><Eyebrow>Sample data</Eyebrow><h3>A small look at the workflow</h3></div><span className="l-sample-badge"><i /> Illustrative only</span></div>
    <div className="l-demo-file"><FileSpreadsheet size={18} /><span>sales_q3_sample.csv</span><span className="l-file-note">Example file</span></div>
    <div className="l-demo-controls"><button className="l-button" type="button" onClick={run} disabled={state === 'running'}>{state === 'running' ? <><span className="l-spinner" /> Analyzing sample…</> : state === 'done' ? <>Sample analyzed <Check size={16} /></> : <>Run sample analysis <ArrowRight size={16} /></>}</button>{state !== 'idle' && <button type="button" className="l-text-button" onClick={reset}>Reset</button>}</div>
    <div className={`l-demo-results ${state === 'done' ? 'is-visible' : ''}`} aria-live="polite" aria-atomic="true" aria-hidden={state !== 'done'}>
      {state !== 'done' && <div className={`l-demo-skeleton ${state === 'running' ? 'is-running' : ''}`} aria-hidden="true"><div className="l-skeleton-kpis">{[0,1,2].map(n=><div key={n}><i/><b/><small/></div>)}</div><div className="l-skeleton-chart"><div className="l-skeleton-chart-title"/><div className="l-skeleton-bars">{[36,56,47,73,61,88].map((height,n)=><i key={n} style={{height:`${height}%`}}/>)}</div></div></div>}
      {state === 'done' && <>
      <div className="l-demo-kpis"><div><span>Sample revenue</span><strong><CountValue end={248600} active={state==='done'} format={v=>`$${(v/1000).toFixed(1)}k`}/></strong></div><div><span>Sample orders</span><strong><CountValue end={1284} active={state==='done'} format={v=>v.toLocaleString('en-US')}/></strong></div><div><span>Top region</span><strong>West</strong></div></div>
      <div className="l-chart" role="img" aria-label="Illustrative monthly sample revenue bar chart">
        <div className="l-chart-label">Illustrative monthly revenue <span>Sample values</span></div>
        <div className="l-chart-bars">{[{m:'Jan',v:42},{m:'Feb',v:58},{m:'Mar',v:50},{m:'Apr',v:72},{m:'May',v:64},{m:'Jun',v:88}].map(x => <div key={x.m} className="l-bar-wrap"><div className="l-bar" style={{height:`${x.v}%`}} title={`${x.m}: sample ${x.v}`} /><small>{x.m}</small></div>)}</div>
      </div>
      </>}
    </div>
  </div>;
}

function Features() {
  // TODO: verify AI insight availability and forecasting support for the target deployment.
  const features = [
    { c:'l-feature-large', tag:'01 / EXPLORE', title:'Interactive dashboard', desc:'Review sales performance through clear charts and summary metrics.', icon:BarChart3, visual:<div className="l-mini-chart">{[34,52,43,71,60,88,74,95].map((h,i)=><i key={i} style={{height:`${h}%`}} />)}</div> },
    { c:'l-feature-large', tag:'02 / UNDERSTAND', title:'AI insights', desc:'Get clear, plain-language answers to sales questions.', icon:Sparkles, visual:<div className="l-insight-visual"><span><Sparkles size={14}/> Example insight</span><p>Which category generated the most revenue?</p><b>Home goods leads this sample period.</b></div> },
    { c:'l-feature-small', tag:'03 / PLAN', title:'Forecasting', desc:'Project revenue trends from historical sales.', icon:TrendingUp, visual:<svg className="l-sparkline" viewBox="0 0 120 42" aria-hidden="true"><path d="M2 34 C18 32 19 18 34 23 S50 34 63 20 S81 23 92 12 S105 18 118 4" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M2 34 C18 32 19 18 34 23 S50 34 63 20 S81 23 92 12 S105 18 118 4" fill="none" stroke="currentColor" strokeWidth="6" opacity=".06"/></svg> },
    { c:'l-feature-small', tag:'04 / COMPARE', title:'Regional analytics', desc:'Compare revenue across regions.', icon:Globe, visual:<div className="l-region-rows"><i style={{width:'88%'}}/><i style={{width:'66%'}}/><i style={{width:'49%'}}/></div> },
    { c:'l-feature-small', tag:'05 / RELATIONSHIPS', title:'Customer analytics', desc:'See unique customer totals and sales activity.', icon:Users, visual:<div className="l-customer-visual"><Users size={25}/><b>Customer activity</b><span>Sample view</span></div> },
    { c:'l-feature-medium', tag:'06 / BREAK DOWN', title:'Product & category analytics', desc:'Explore top products and revenue by category.', icon:BarChart3, visual:<div className="l-product-visual"><span>Top product <b>Sample item A</b></span><span>Category <b>Accessories</b></span><span>Revenue <b>$42.8k</b></span></div> },
    { c:'l-feature-small', tag:'07 / SHARE', title:'CSV & PDF exports', desc:'Export report data or a dashboard view.', icon:Download, visual:<div className="l-export-icons"><span><FileSpreadsheet size={16}/> CSV</span><span><Download size={16}/> PDF</span></div> },
  ];
  return <section className="l-section" id="features" aria-labelledby="features-title"><div className="l-container"><SectionHeading label="02 — FEATURES" id="features-title">Everything you need. <em>Nothing</em> you don’t.</SectionHeading><div className="l-bento">{features.map(({c,tag,title,desc,icon:Icon,visual})=><article className={`l-feature-card ${c}`} key={title}><div className="l-feature-copy"><Eyebrow>{tag}</Eyebrow><h3>{title}</h3><p>{desc}</p></div><div className="l-feature-visual">{visual}</div><Icon className="l-feature-icon" size={18} aria-hidden="true" /></article>)}</div></div></section>;
}

function Analyst() {
  const host = useRef(null); const [show, setShow] = useState(false); const [reduced, setReduced] = useState(false);
  const answer = 'In this illustrative example, Home goods leads with $84,200 in sample revenue. Furniture follows at $61,400.';
  useEffect(() => { const mq = window.matchMedia('(prefers-reduced-motion: reduce)'); setReduced(mq.matches); const listener = () => setReduced(mq.matches); mq.addEventListener?.('change', listener); return () => mq.removeEventListener?.('change', listener); }, []);
  useEffect(() => { if (!host.current) return; const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setShow(true); observer.disconnect(); } }, { threshold: .25 }); observer.observe(host.current); return () => observer.disconnect(); }, []);
  const [typed, setTyped] = useState('');
  useEffect(() => { if (!show) return; if (reduced) { setTyped(answer); return; } let i=0; const timer=setInterval(()=>{i+=1;setTyped(answer.slice(0,i));if(i>=answer.length)clearInterval(timer);},25); return ()=>clearInterval(timer); }, [show,reduced]);
  return <section className="l-section l-analyst" aria-labelledby="analyst-title"><div className="l-container l-analyst-grid"><div><Eyebrow>03 — AI ANALYST</Eyebrow><h2 id="analyst-title">Ask a question. Get the <em>answer</em>.</h2><p>A sample answer pairs a sales question with the revenue breakdown behind it. Values shown are illustrative.</p></div><div className="l-chat-card" ref={host}><div className="l-chat-top"><span className="l-chat-dot"/><strong>Example conversation</strong><span className="l-example-pill">SAMPLE</span></div><div className="l-user-bubble">Which category generated the most revenue?</div><div className="l-answer"><span className="l-answer-mark"><Sparkles size={15}/></span><div><p>{typed}{show && typed.length < answer.length && !reduced && <span className="l-caret"/>}</p><div className="l-inline-bars" aria-label="Illustrative category revenues"><span><i style={{width:'88%'}}/>Home goods <b>$84.2k</b></span><span><i style={{width:'64%'}}/>Furniture <b>$61.4k</b></span><span><i style={{width:'43%'}}/>Office <b>$40.8k</b></span></div><small>Illustrative sample values</small></div></div></div></div></section>;
}

function UseCases() { return <section className="l-section l-usecases" aria-labelledby="usecases-title"><div className="l-container"><SectionHeading label="04 — WHO IT’S FOR" id="usecases-title">Clearer numbers for <em>everyday</em> decisions.</SectionHeading><div className="l-use-grid">{[['Sales managers','Bring key sales measures into one view.','Spot patterns and review team performance.'],['Founders','Get a quicker read on the numbers in your sales data.','Spend less time assembling basic summaries.'],['Analysts','Start with structured charts and breakdowns.','Move from file to exploration with fewer steps.']].map(([name,pain,outcome])=><article key={name}><h3>{name}</h3><p>{pain}</p><span>{outcome}</span></article>)}</div></div></section>; }

function Security() { return <section className="l-security" aria-labelledby="security-title"><div className="l-container l-security-inner"><div><Eyebrow>PRIVACY & ACCESS</Eyebrow><h2 id="security-title">Your data stays <em>yours</em>.</h2></div><div className="l-security-points"><p><Shield size={17}/> Sign-in required for projects and reports.</p><p><Database size={17}/> Project data is served through authenticated access.</p><p><CircleHelp size={17}/> Ask the team about deployment-specific storage and retention.</p></div></div></section>; }

function Faq() {
  const [open, setOpen] = useState(-1);
  return <section className="l-section" id="faq" aria-labelledby="faq-title"><div className="l-container l-faq"><div><Eyebrow>05 — FAQ</Eyebrow><h2 id="faq-title">A few useful <em>details</em>.</h2><p>Answers based on the current product and codebase.</p></div><div className="l-faq-list">{faqItems.map((item,i)=><div className="l-faq-item" key={item.q}><h3><button type="button" id={`faq-trigger-${i}`} aria-expanded={open===i} aria-controls={`faq-panel-${i}`} onClick={()=>setOpen(open===i?-1:i)}>{item.q}<span>{open===i?<Minus size={18}/>:<Plus size={18}/>}</span></button></h3><div className="l-faq-panel" id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-trigger-${i}`} aria-hidden={open!==i} style={{gridTemplateRows:open===i?'1fr':'0fr'}}><div><p>{item.a}</p></div></div></div>)}</div></div></section>;
}

function Footer() { return <footer className="l-footer"><div className="l-container"><div className="l-footer-top"><div><Link className="l-brand" to="/"><span className="l-brand-mark"><Zap size={17}/></span><span>SalesIntel</span></Link><p>A clearer view of your sales data.</p></div><div className="l-footer-links"><a href="#features">Features</a><a href="#how-it-works">How it works</a><a href="#faq">FAQ</a><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub <ArrowDownRight size={14}/></a></div></div><div className="l-footer-bottom"><span>© 2026 SalesIntel</span><span>Made by Vivek Misar</span></div></div></footer>; }

export default function LandingPage() {
  const { isAuthenticated } = useAuth(); const navigate = useNavigate();
  useEffect(() => { if (isAuthenticated) navigate('/dashboard', { replace:true }); }, [isAuthenticated,navigate]);
  useEffect(() => { const oldTitle=document.title; document.title='SalesIntel: Sales intelligence from a CSV'; const desc=document.querySelector('meta[name="description"]'); const old=desc?.content; if(desc)desc.content='Turn sales CSV data into clear dashboards and practical analytics with SalesIntel.'; return ()=>{document.title=oldTitle;if(desc&&old!==undefined)desc.content=old;}; }, []);
  if (isAuthenticated) return null;
  return <div className="landing-root"><LNav/><main><section className="l-hero" aria-label="Sales intelligence platform introduction"><div className="l-container"><div className="l-hero-copy"><Eyebrow dot>SALES INTELLIGENCE PLATFORM</Eyebrow><h1>Sales data,<br/><em>finally</em> legible.</h1><p>Upload a CSV and explore sales dashboards, key metrics and product breakdowns. Turn a file into a clearer view of your numbers.</p><div className="l-hero-actions"><PrimaryLink/><a className="l-secondary" href="#how-it-works">See how it works <ArrowRight size={15}/></a></div></div><div className="l-preview-frame"><DashboardPreview/></div><div className="l-stack-note">React <span>·</span> Vite <span>·</span> Tailwind <span>·</span> FastAPI</div></div></section>
  <section className="l-section" id="how-it-works" aria-labelledby="workflow-title"><div className="l-container"><SectionHeading label="01 — HOW IT WORKS" id="workflow-title">From raw CSV to <em>decision</em> in three steps.</SectionHeading><div className="l-steps">{[['01','Upload','Bring a sales CSV into a project.'],['02','Analyze','Review the calculated sales metrics and breakdowns.'],['03','Decide','Explore the results, then share an export.']].map(([n,title,desc])=><article key={n}><span className="l-step-number">{n}</span><h3>{title}</h3><p>{desc}</p></article>)}</div><Demo/></div></section>
  <Features/><Analyst/><UseCases/><Security/><Faq/>
  <section className="l-cta" aria-labelledby="cta-title"><div className="l-container"><Eyebrow>MAKE YOUR NEXT REVIEW CLEARER</Eyebrow><h2 id="cta-title">Ready to <em>see</em> your numbers clearly?</h2><PrimaryLink/><p>Upload a CSV and explore your sales data.</p></div></section>
  </main><Footer/></div>;
}
