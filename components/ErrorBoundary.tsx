import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("System Failure:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-red-900/50 rounded-2xl p-8 text-center max-w-md w-full shadow-2xl">
            <div className="flex justify-center mb-6">
                <AlertTriangle className="text-red-500" size={48} />
            </div>
            <h1 className="text-xl font-bold text-red-500 mb-2">PROTOCOL INTERRUPTED</h1>
            <p className="text-sm text-slate-400 mb-8">
                The application encountered a critical tactical failure.
            </p>
            <button 
                onClick={() => window.location.reload()} 
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <RefreshCw size={18} /> Reboot System
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
