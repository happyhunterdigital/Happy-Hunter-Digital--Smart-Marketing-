import React, { useState } from 'react';
import { Search, AlertTriangle, Loader2, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { functions } from '../firebaseConfig';
import { httpsCallable } from 'firebase/functions';

export const AiAudit: React.FC = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ biz: '', loc: '', mail: '' });
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const performAudit = httpsCallable(functions, 'performAudit');
      const result: any = await performAudit({ businessName: form.biz, location: form.loc, clientEmail: form.mail });
      setRes(result.data);
      setStep(3);
    } catch (err) { alert("Neural Handshake Interrupted."); }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-10 bg-black border border-gray-800 rounded-[2.5rem] mt-10">
      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
          <input className="w-full bg-gray-900 p-4 rounded-xl text-white outline-none border border-gray-800" placeholder="Business Name" onChange={e => setForm({...form, biz: e.target.value})} required />
          <input className="w-full bg-gray-900 p-4 rounded-xl text-white outline-none border border-gray-800" placeholder="Location" onChange={e => setForm({...form, loc: e.target.value})} required />
          <button type="submit" className="w-full bg-yellow-500 p-4 rounded-xl font-black text-black uppercase flex items-center justify-center gap-2">Initiate Scan <ArrowRight/></button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={run} className="space-y-4">
          <input className="w-full bg-gray-900 p-4 rounded-xl text-white outline-none border border-gray-800" placeholder="Email" type="email" onChange={e => setForm({...form, mail: e.target.value})} required />
          <button disabled={loading} className="w-full bg-yellow-500 p-4 rounded-xl font-black text-black uppercase flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck/>} Secure Results
          </button>
        </form>
      )}
      {step === 3 && res && (
        <div className="text-left animate-fade-in">
          <h3 className="text-4xl font-black text-yellow-500 mb-4">{res.score}/100</h3>
          <p className="text-gray-300 leading-relaxed italic">"{res.summary}"</p>
        </div>
      )}
    </div>
  );
};
