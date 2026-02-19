import React, { useState } from 'react';
import { Search, AlertTriangle, Loader2, Zap } from 'lucide-react';
import { db, functions } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import emailjs from '@emailjs/browser';

export const AiAudit: React.FC = () => {
  const [form, setForm] = useState({ biz: '', loc: '', mail: '' });
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);

  const runGemini3Scan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const performAudit = httpsCallable(functions, 'performAudit');
      const result = await performAudit({ businessName: form.biz, location: form.loc });
      
      const data: any = result.data;
      setRes(data);

      // Persistence
      await addDoc(collection(db, 'leads'), { ...form, score: data.score, timestamp: serverTimestamp(), model: 'Gemini 3 Flash' });
      
      // Dispatch
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID, 
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID, 
        { to_email: form.mail, business_name: form.biz, audit_score: data.score, summary: data.summary }, 
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
        
    } catch (err: any) {
      alert("Gemini 3 Handshake Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-10 bg-black border border-brand-yellow/20 rounded-[2.5rem] shadow-[0_0_50px_rgba(234,179,8,0.1)] mt-10">
      <div className="flex items-center gap-2 mb-8 justify-center">
        <Zap className="text-brand-yellow fill-brand-yellow animate-pulse" size={20}/>
        <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-yellow">Gemini 3 Flash Active</span>
      </div>

      {!res ? (
        <form onSubmit={runGemini3Scan} className="space-y-6">
          <input className="w-full bg-gray-900/50 p-5 rounded-2xl border border-gray-800 text-white outline-none focus:border-brand-yellow" placeholder="Business Name" onChange={e => setForm({...form, biz: e.target.value})} required />
          <input className="w-full bg-gray-900/50 p-5 rounded-2xl border border-gray-800 text-white outline-none focus:border-brand-yellow" placeholder="Location" onChange={e => setForm({...form, loc: e.target.value})} required />
          <input className="w-full bg-gray-900/50 p-5 rounded-2xl border border-gray-800 text-white outline-none focus:border-brand-yellow" placeholder="Client Email" type="email" onChange={e => setForm({...form, mail: e.target.value})} required />
          <button className="w-full bg-brand-yellow p-5 rounded-2xl font-black uppercase text-brand-dark flex items-center justify-center gap-3 hover:bg-white transition-all">
            {loading ? <Loader2 className="animate-spin" /> : <Search />} Initiate Gemini 3 Protocol
          </button>
        </form>
      ) : (
        <div className="text-left animate-fade-in space-y-6">
          <div className="flex justify-between items-center border-b border-gray-800 pb-6">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Diagnostic Score</h3>
            <span className="text-6xl font-black text-brand-yellow">{res.score}</span>
          </div>
          <p className="text-gray-400 leading-relaxed font-medium italic">"{res.summary}"</p>
          <div className="space-y-3">
            {res.truths.map((t: string, i: number) => (
              <div key={i} className="p-4 bg-red-500/5 border-l-4 border-red-500 text-red-200 text-sm flex gap-3">
                <AlertTriangle className="shrink-0" size={18}/> {t}
              </div>
            ))}
          </div>
          <button onClick={() => setRes(null)} className="w-full text-gray-600 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors">Clear Neural Cache</button>
        </div>
      )}
    </div>
  );
};
