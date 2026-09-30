import React from 'react';
import { AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react';

/**
 * Error Boundary — catches unhandled render errors and shows a
 * styled fallback instead of a blank screen.
 *
 * Supports both dark and light mode via Tailwind's `dark:` variants.
 * Provides "Go Back" and "Reload" actions for recovery.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleGoBack = () => {
    window.history.back();
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
          <div className="text-center max-w-lg">
            {/* Icon */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-6">
              <AlertTriangle size={32} className="text-red-500" />
            </div>

            {/* Heading */}
            <h1
              className="text-2xl font-bold text-slate-900 dark:text-white mb-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Something went wrong
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              An unexpected error occurred in the application. Try going back or reloading the page.
            </p>

            {/* Error details (dev only) */}
            {this.state.error && (
              <details className="mb-6 text-left rounded-xl border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 p-4">
                <summary className="text-sm font-medium text-red-700 dark:text-red-400 cursor-pointer">
                  Error details
                </summary>
                <pre className="mt-3 text-xs text-red-600 dark:text-red-300 overflow-auto whitespace-pre-wrap break-words max-h-48">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleGoBack}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft size={16} />
                Go Back
              </button>
              <button
                onClick={this.handleReload}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
              >
                <RotateCcw size={16} />
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
