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

  const runGemini3Scan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // Client-side validation
    if (!form.biz.trim() || !form.loc.trim() || !form.mail.trim()) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.mail)) {
      setError("Please enter a valid email address");
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

      // Check if the response indicates failure
      if (!data.success) {
        throw new Error(data.error || "Audit failed");
      }

      setResult(data);

      // Persist to local analytics (optional, backend already does this)
      await addDoc(collection(db, 'audit_logs'), {
        businessName: form.biz,
        location: form.loc,
        score: data.score,
        timestamp: serverTimestamp()
      });

    } catch (err: any) {
      console.error("Audit error:", err);
      setError(err.message || "Gemini 3 Handshake Error. Please retry.");
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
    <div className="max-w-2xl mx-auto p-6 md:p-10 bg-black border border-yellow-500/20 rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.1)] mt-10">
      <div className="flex items-center gap-2 mb-8 justify-center">
        <Zap className="text-yellow-500 fill-yellow-500 animate-pulse" size={20} />
        <span className="text-xs font-black uppercase tracking-[0.3em] text-yellow-500">
          Gemini 3 Flash Active
        </span>
      </div>

      {!result ? (
        <form onSubmit={runGemini3Scan} className="space-y-6">
          <div>
            <input
              className="w-full bg-gray-900/50 p-5 rounded-2xl border border-gray-800 text-white outline-none focus:border-yellow-500 transition-colors"
              placeholder="Business Name"
              value={form.biz}
              onChange={e => setForm({ ...form, biz: e.target.value })}
              disabled={loading}
              required
            />
          </div>
          <div>
            <input
              className="w-full bg-gray-900/50 p-5 rounded-2xl border border-gray-800 text-white outline-none focus:border-yellow-500 transition-colors"
              placeholder="Location (City, State)"
              value={form.loc}
              onChange={e => setForm({ ...form, loc: e.target.value })}
              disabled={loading}
              required
            />
          </div>
          <div>
            <input
              className="w-full bg-gray-900/50 p-5 rounded-2xl border border-gray-800 text-white outline-none focus:border-yellow-500 transition-colors"
              placeholder="Client Email"
              type="email"
              value={form.mail}
              onChange={e => setForm({ ...form, mail: e.target.value })}
              disabled={loading}
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
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
                Scanning Digital Footprint...
              </>
            ) : (
              <>
                <Search size={20} />
                Initiate Gemini 3 Protocol
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="text-left animate-fade-in space-y-6">
          <div className="flex justify-between items-center border-b border-gray-800 pb-6">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">
              Diagnostic Score
            </h3>
            <div className="flex items-center gap-3">
              {getScoreIcon(result.score)}
              <span className={`text-6xl font-black ${getScoreColor(result.score)}`}>
                {result.score}
              </span>
              <span className="text-2xl text-gray-600">/100</span>
            </div>
          </div>

          <p className="text-gray-400 leading-relaxed font-medium italic text-lg">
            {result.summary}
          </p>

          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-red-400 mb-3">
              Critical Intelligence Gaps
            </h4>
            {result.truths?.map((truth, i) => (
              <div
                key={i}
                className="p-4 bg-red-500/5 border-l-4 border-red-500 text-red-200 text-sm flex gap-3 items-start"
              >
                <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                <span>{truth}</span>
              </div>
            ))}
          </div>

          {result.placeData && (
            <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Google Maps Verification
              </h4>
              <p className="text-white font-medium">{result.placeData.displayName?.text}</p>
              <p className="text-gray-400 text-sm">{result.placeData.formattedAddress}</p>
              {result.placeData.rating && (
                <p className="text-yellow-500 text-sm mt-1">
                  Rating: {result.placeData.rating} ⭐ ({result.placeData.userRatingCount} reviews)
                </p>
              )}
            </div>
          )}

          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <p className="text-yellow-200 text-sm">
              <strong>Report dispatched to:</strong> {form.mail}
            </p>
            <p className="text-yellow-500/70 text-xs mt-1">
              Check your inbox for the full intelligence briefing.
            </p>
          </div>

          <button
            onClick={() => {
              setResult(null);
              setForm({ biz: '', loc: '', mail: '' });
            }}
            className="w-full text-gray-600 text-xs uppercase font-bold tracking-widest hover:text-white transition-colors py-4"
          >
            Clear Neural Cache & Run New Scan
          </button>
        </div>
      )}
    </div>
  );
};
