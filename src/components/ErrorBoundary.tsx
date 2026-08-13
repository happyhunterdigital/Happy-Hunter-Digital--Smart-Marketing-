import React from 'react';
import { ErrorReporter } from '../sentry';

interface Props { children: React.ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(_: Error): State { return { hasError: true }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("App Error:", error, info.componentStack);
    ErrorReporter.captureError(error, { componentStack: info.componentStack });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-3xl md:text-4xl font-black uppercase text-yellow-500 mb-4 tracking-tight">Something Went Wrong</h1>
          <p className="text-gray-400 mb-8 max-w-md text-sm md:text-base leading-relaxed">
            We encountered a temporary error loading this section. Please try refreshing the page or returning home.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => window.location.reload()} className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-black uppercase text-xs tracking-wider hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20">Reload Page</button>
            <a href="/" className="bg-white/10 text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-wider border border-white/20 hover:bg-white/20 transition-all">Go to Homepage</a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
