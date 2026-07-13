import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const FOOTER_LINKS = {
  Product: ['Features', 'Pricing', 'Integrations', 'Changelog'],
  Company: ['About Us', 'Careers', 'Contact', 'Partners'],
  Resources: ['Documentation', 'API Reference', 'Blog', 'Help Center'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy']
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md inline-block w-fit">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                SalesIntel
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-6">
              The modern revenue intelligence platform. Stop guessing, start growing with AI-powered sales analytics.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded" aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="col-span-1 lg:col-span-1">
              <h3 className="font-semibold text-white mb-4">{title}</h3>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-900">
          <p className="text-slate-500 text-sm">
            &copy; {currentYear} SalesIntel Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Made by</span>
            <a href="#" className="text-white hover:text-indigo-400 transition-colors font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded">
              Vivek Misar
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
