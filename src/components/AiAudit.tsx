import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Search, Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';

export const AiAudit = () => {
  const [bizName, setBizName] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) {
      alert("System not initialized. Check Firebase Config.");
      return;
    }
    setLoading(true);

    try {
      // Save to Firestore 'mail' collection for your Admin Dashboard
      await addDoc(collection(db, "mail"), {
        to: email,
        businessName: bizName,
        location: location,
        status: "new",
        date: serverTimestamp(),
        message: {
          subject: `⚠️ Critical Gaps Detected for ${bizName}`,
          html: `<h1>Audit Initiated</h1><p>We are analyzing ${bizName} in ${location}. Strategy follow-up pending.</p>`
        }
      });

      setStatus('success');
      setBizName('');
      setLocation('');
      setEmail('');
    } catch (error) {
      console.error("Audit Submission Error:", error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-4xl mx-auto my-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-transparent"></div>
      
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 text-white">
          2026 <span className="text-yellow-500">Readiness</span> Audit
        </h2>
        <p className="text-slate-500 italic">Reveal the invisibility gaps in your Digital Entity.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <input
            required
            placeholder="Business Name"
            className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-yellow-500 outline-none transition-all"
            value={bizName}
            onChange={(e) => setBizName(e.target.value)}
          />
          <input
            required
            placeholder="Location (e.g. Pretoria)"
            className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-yellow-500 outline-none transition-all"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type="email"
            required
            placeholder="Email Address"
            className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-yellow-500 outline-none transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-slate-950 font-black py-5 rounded-xl flex items-center justify-center gap-3 hover:bg-yellow-400 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
            INITIATE SCAN
          </button>
        </div>

        <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-2xl flex flex-col justify-center space-y-4">
           <div className="flex items-center gap-3 text-yellow-500">
             <ShieldCheck size={20}/>
             <span className="text-[10px] font-black uppercase tracking-widest">Protocol Mirror Rule</span>
           </div>
           <p className="text-xs text-slate-500 leading-relaxed font-medium">
             Our AI engine will scan the Knowledge Graph for your business. We look for data inconsistencies, missing Trust Signals, and AI recommendation roadblocks.
           </p>
           {status === 'success' && (
             <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-lg text-xs font-bold animate-pulse">
               ✅ Audit Initiated. Check your inbox.
             </div>
           )}
        </div>
      </form>
    </div>
  );
};
