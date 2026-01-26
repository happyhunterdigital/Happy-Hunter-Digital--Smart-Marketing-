import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };
  public static getDerivedStateFromError(_: Error): State { return { hasError: true }; }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-red-900/50 rounded-2xl p-8 text-center max-w-md shadow-2xl">
            <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
            <h1 className="text-2xl font-bold mb-2 text-red-500 tracking-tight">PROTOCOL INTERRUPTED</h1>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} /> Reboot System
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
