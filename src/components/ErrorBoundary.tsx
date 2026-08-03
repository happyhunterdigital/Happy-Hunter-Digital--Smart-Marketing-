import React from 'react';

interface Props { children: React.ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(_: Error): State { return { hasError: true }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) { console.error(error, info.componentStack); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-4xl font-black uppercase text-yellow-500 mb-4">System Anomaly</h1>
          <p className="text-gray-400 mb-6">A subsystem crashed. Please refresh.</p>
          <button onClick={() => window.location.reload()} className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-black uppercase text-sm">Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}
