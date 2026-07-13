import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ_DATA = [
  { 
    q: 'What type of CSV files are supported?', 
    a: 'We support standard comma-separated values (.csv) exports from Salesforce, HubSpot, Stripe, Shopify, and custom internal tools. The system automatically detects column headers and data types.' 
  },
  { 
    q: 'How is my data secured?', 
    a: 'Security is our top priority. We use AES-256 encryption at rest and TLS 1.3 in transit. Your uploaded files are processed in ephemeral memory and immediately discarded unless you explicitly choose to save them.' 
  },
  { 
    q: 'What export options are available?', 
    a: 'You can export your interactive dashboards and generated insights as PDF reports for executives, or download the cleaned and enriched data back as a CSV for further offline analysis.' 
  },
  { 
    q: 'Is there a maximum upload size?', 
    a: 'The free tier supports files up to 10MB. Enterprise plans support up to 500MB per file with distributed chunked uploading for stability.' 
  },
  { 
    q: 'How do the AI Insights work?', 
    a: 'Our platform uses a specialized language model fine-tuned on financial and sales data. It parses the statistical output of our Python backend (Pandas/NumPy) and generates human-readable narratives and anomaly alerts.' 
  },
  { 
    q: 'How accurate is the forecasting?', 
    a: 'We utilize advanced time-series forecasting (ARIMA and Prophet models). Accuracy depends heavily on the volume and quality of your historical data, but typical variance is within 5-8% for 30-day projections.' 
  },
];

export default function Faq() {
  return (
    <section className="py-32 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-3xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {FAQ_DATA.map((item, index) => (
            <FaqItem key={index} question={item.q} answer={item.a} />
          ))}
        </div>

      </div>
    </section>
  );
}

function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden transition-colors hover:border-indigo-500/50">
      <button 
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-slate-900 dark:text-white">{question}</span>
        <ChevronDown 
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          size={20} 
        />
      </button>
      <div 
        className="grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-5 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}
