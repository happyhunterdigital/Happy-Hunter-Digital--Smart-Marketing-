import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🔴 Global Error Boundary caught:', error, errorInfo);
    this.setState({ error, errorInfo });

    // Log to analytics if available
    if (import.meta.env.PROD) {
      console.error('Production error logged:', {
        error: error.toString(),
        stack: errorInfo.componentStack,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      });
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-slate-900 border border-red-500/30 rounded-3xl p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-500" size={40} />
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase text-white mb-4">
              System Malfunction
            </h1>
            <p className="text-slate-400 mb-8 text-lg">
              A critical error has compromised the interface. The engineering team has been notified.
            </p>
            
            {import.meta.env.DEV && this.state.error && (
              <div className="bg-slate-950 rounded-xl p-4 mb-8 text-left overflow-auto max-h-64 border border-slate-800">
                <p className="text-red-400 font-mono text-sm mb-2">
                  {this.state.error.toString()}
                </p>
                <pre className="text-slate-500 font-mono text-xs whitespace-pre-wrap">
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 bg-yellow-500 text-slate-950 px-8 py-4 rounded-xl font-black uppercase hover:bg-yellow-400 transition-colors"
              >
                <RefreshCw size={18} /> Reload System
              </button>
              <Link
                to="/"
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 bg-slate-800 text-white px-8 py-4 rounded-xl font-black uppercase hover:bg-slate-700 transition-colors"
              >
                <Home size={18} /> Return Home
              </Link>
            </div>

            <p className="mt-8 text-slate-600 text-xs font-bold uppercase tracking-widest">
              Error ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
