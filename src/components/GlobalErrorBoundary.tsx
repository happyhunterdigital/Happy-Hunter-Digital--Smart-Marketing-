import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("System Failure:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
          <div className="text-center max-w-md border border-red-500/30 p-8 rounded-2xl bg-gray-950">
            <h1 className="text-2xl font-black text-red-500 uppercase tracking-widest mb-4">System Anomaly</h1>
            <p className="text-gray-400 mb-6 text-sm">
              A critical rendering error was intercepted. The diagnostic engine has paused to prevent data corruption.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold py-3 px-8 rounded-xl transition-all uppercase tracking-wider text-xs"
            >
              Re-Initialize System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
