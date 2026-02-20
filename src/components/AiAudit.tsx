import React, { useState } from 'react';
import { Search, AlertTriangle, Loader2, Zap, CheckCircle, XCircle } from 'lucide-react';
import { functions } from '../firebaseConfig';
import { httpsCallable } from 'firebase/functions';

export const AiAudit: React.FC = () => {
  const [form, setForm] = useState({ biz: '', loc: '', mail: '' });
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runSmartScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRes(null);

    try {
      const performAudit = httpsCallable(functions, 'performAudit');
      const result = await performAudit({
        businessName: form.biz,
        location: form.loc,
        clientEmail: form.mail
      });

      if (result.data) {
        setRes(result.data);
      }
    } catch (err: any) {
      console.error(err);
      setError("The Audit System is currently overloaded or blocked. Please try again in 60 seconds.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="max-w-2xl mx-auto p-10 bg-[#0a0a0a] border border-brand-yellow/20 rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.1)] mt-10">
      <div className="flex items-center gap-2 mb-8 justify-center">
        <Zap className="text-brand-yellow fill-brand-yellow animate-pulse" size={20} />
        <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-yellow">
          Smart Marketing Engine
        </span>
      </div>

      {!res ? (
        <form onSubmit={runSmartScan} className="space-y-6">
          <input className="w-full bg-gray-900/50 p-5 rounded-2xl border border-gray-800 text-white outline-none focus:border-brand-yellow transition-all" placeholder="Business Name" onChange={e => setForm({...form, biz: e.target.value})} required />
          <input className="w-full bg-gray-900/50 p-5 rounded-2xl border border-gray-800 text-white outline-none focus:border-brand-yellow transition-all" placeholder="City" onChange={e => setForm({...form, loc: e.target.value})} required />
          <input className="w-full bg-gray-900/50 p-5 rounded-2xl border border-gray-800 text-white outline-none focus:border-brand-yellow transition-all" placeholder="Email Address" type="email" onChange={e => setForm({...form, mail: e.target.value})} required />
          
          {error && <div className="p-4 bg-red-900/20 text-red-400 text-sm rounded-xl text-center font-bold">{error}</div>}

          <button disabled={loading} className="w-full bg-brand-yellow p-5 rounded-2xl font-black uppercase text-brand-dark flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : <Search size={20}/>}
            {loading ? 'Running Forensic Scan...' : 'Initiate Smart Scan'}
          </button>
        </form>
      ) : (
        <div className="text-left animate-fade-in space-y-6">
          <div className="flex justify-between items-center border-b border-gray-800 pb-6">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Visibility Score</h3>
            <span className={`text-6xl font-black ${getScoreColor(res.score)}`}>{res.score}</span>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed italic">"{res.summary}"</p>
          <div className="space-y-3">
             {res.truths.map((t: string, i: number) => (
               <div key={i} className="flex gap-3 p-4 bg-red-500/5 rounded-xl border-l-4 border-red-500 text-red-200 text-sm">
                 <AlertTriangle className="shrink-0" size={18}/> {t}
               </div>
             ))}
          </div>
          <button onClick={() => setRes(null)} className="w-full py-4 text-gray-500 text-xs uppercase font-bold tracking-widest hover:text-white transition-colors">Run New Scan</button>
        </div>
      )}
    </div>
  );
};
