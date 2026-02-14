import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 1. THE SAFETY NET: Catch Anomaly before it flickers
class GlobalErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.hasError = false; // Simplified for browser editor
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error("System Anomaly:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen bg-slate-950 flex items-center justify-center p-10 text-center">
          <div className="p-12 border border-red-500/20 rounded-[3rem] bg-red-500/5 max-w-md">
            <h1 className="text-red-500 font-black uppercase text-2xl mb-4 tracking-tighter text-white">System Anomaly</h1>
            <p className="text-slate-500 text-sm mb-8 italic">A critical rendering error was intercepted. The diagnostic engine has paused to prevent data corruption.</p>
            <button onClick={() => window.location.reload()} className="bg-yellow-500 text-slate-950 px-8 py-3 rounded-xl font-black uppercase text-xs">Re-Initialize System</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  document.body.innerHTML = '<h1 style="color:white; background:black; padding:50px">CRITICAL: DOM ROOT MISSING</h1>';
  throw new Error("Handshake failed.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </React.StrictMode>
);
