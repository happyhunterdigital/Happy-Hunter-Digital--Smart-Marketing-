import React, { useState } from 'react';
import { Search, AlertTriangle, Loader2, Zap, CheckCircle, XCircle } from 'lucide-react';
import { db, functions } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

interface AuditResult {
  success: boolean;
  score: number;
  summary: string;
  truths: string[];
  placeData?: any;
  error?: string;
}

export const AiAudit: React.FC = () => {
  const [form, setForm] = useState({ biz: '', loc: '', mail: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runSmartScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    if (!form.biz.trim() || !form.loc.trim() || !form.mail.trim()) {
      setError("Please fill in all fields to generate your report.");
      setLoading(false);
      return;
    }

    try {
      const performAudit = httpsCallable(functions, 'performAudit');
      const response = await performAudit({
        businessName: form.biz.trim(),
        location: form.loc.trim(),
        clientEmail: form.mail.trim()
      });

      const data = response.data as AuditResult;

      if (!data.success) {
        throw new Error(data.error || "Scan interrupted. Please try again.");
      }

      setResult(data);

      await addDoc(collection(db, 'audit_logs'), {
        businessName: form.biz,
        location: form.loc,
        score: data.score,
        timestamp: serverTimestamp()
      });

    } catch (err: any) {
      console.error("Audit error:", err);
      // Friendly error message instead of raw system errors
      setError("Our AI is experiencing high traffic. Please try again in a few moments.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 70) return <CheckCircle className="text-green-500" size={32} />;
    if (score >= 40) return <AlertTriangle className="text-yellow-500" size={32} />;
    return <XCircle className="text-red-500" size={32} />;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-10 bg-[#0a0a0a] border border-yellow-500/20 rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.05)] mt-10">
      <div className="flex items-center gap-2 mb-8 justify-center">
        <Zap className="text-yellow-500 fill-yellow-500 animate-pulse" size={20} />
        <span className="text-xs font-black uppercase tracking-[0.2em] text-yellow-500">
          Smart AI Marketing Engine
        </span>
      </div>

      {!result ? (
        <form onSubmit={runSmartScan} className="space-y-6">
          <div>
            <input
              className="w-full bg-gray-900/50 p-5 rounded-2xl border border-gray-800 text-white outline-none focus:border-yellow-500 transition-colors"
              placeholder="Your Business Name"
              value={form.biz}
              onChange={e => setForm({ ...form, biz: e.target.value })}
              disabled={loading}
              required
            />
          </div>
          <div>
            <input
              className="w-full bg-gray-900/50 p-5 rounded-2xl border border-gray-800 text-white outline-none focus:border-yellow-500 transition-colors"
              placeholder="City or Area"
              value={form.loc}
              onChange={e => setForm({ ...form, loc: e.target.value })}
              disabled={loading}
              required
            />
          </div>
          <div>
            <input
              className="w-full bg-gray-900/50 p-5 rounded-2xl border border-gray-800 text-white outline-none focus:border-yellow-500 transition-colors"
              placeholder="Where should we send your report?"
              type="email"
              value={form.mail}
              onChange={e => setForm({ ...form, mail: e.target.value })}
              disabled={loading}
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 p-5 rounded-2xl font-black uppercase text-black flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Analyzing Digital Footprint...
              </>
            ) : (
              <>
                <Search size={20} />
                Initiate Smart Marketing Scan
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="text-left animate-fade-in space-y-6">
          <div className="flex justify-between items-center border-b border-gray-800 pb-6">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">
              Visibility Score
            </h3>
            <div className="flex items-center gap-3">
              {getScoreIcon(result.score)}
              <span className={`text-6xl font-black ${getScoreColor(result.score)}`}>
                {result.score}
              </span>
              <span className="text-2xl text-gray-600">/100</span>
            </div>
          </div>

          <p className="text-gray-300 leading-relaxed font-medium text-lg">
            {result.summary}
          </p>

          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-yellow-500 mb-3">
              Key Growth Opportunities
            </h4>
            {result.truths?.map((truth, i) => (
              <div
                key={i}
                className="p-4 bg-gray-900/50 border-l-4 border-yellow-500 text-gray-300 text-sm flex gap-3 items-start rounded-r-lg"
              >
                <AlertTriangle className="shrink-0 mt-0.5 text-yellow-500" size={18} />
                <span>{truth}</span>
              </div>
            ))}
          </div>

          <div className="p-5 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-center">
            <p className="text-yellow-500 font-bold mb-1">
              Your detailed report is on its way!
            </p>
            <p className="text-yellow-500/70 text-sm">
              We just emailed the full analysis to <strong>{form.mail}</strong>
            </p>
          </div>

          <button
            onClick={() => {
              setResult(null);
              setForm({ biz: '', loc: '', mail: '' });
            }}
            className="w-full text-gray-500 text-xs uppercase font-bold tracking-widest hover:text-white transition-colors py-4"
          >
            Run Another Scan
          </button>
        </div>
      )}
    </div>
  );
};
