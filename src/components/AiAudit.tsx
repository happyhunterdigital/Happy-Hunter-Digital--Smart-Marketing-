import { useState } from 'react';
import { db, callHunterAI } from '../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Search, Loader2, ShieldCheck } from 'lucide-react';

export default function AiAudit() {
  const [formData, setFormData] = useState({ name: '', loc: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) { alert("Database not connected."); return; }
    
    setLoading(true);
    setStatus('idle');

    try {
      const auditPrompt = `Analyze this business: ${formData.name} in ${formData.loc}. Identify 3 critical digital invisibility gaps for South African SMEs.`;
      const aiAnalysis = await callHunterAI(auditPrompt);

      await addDoc(collection(db, "mail"), {
        to: formData.email,
        businessName: formData.name,
        location: formData.loc,
        timestamp: serverTimestamp(),
        status: "new",
        analysis: aiAnalysis,
        message: {
          subject: `⚠️ Audit Report: ${formData.name}`,
          text: aiAnalysis
        }
      });

      setStatus('success');
      setFormData({ name: '', loc: '', email: '' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-4xl mx-auto my-10 relative overflow-hidden">
      <h2 className="text-3xl font-black text-white mb-6 text-center uppercase tracking-tighter">
        2026 <span className="text-yellow-500">Entity</span> Audit
      </h2>
      
      <form onSubmit={runAudit} className="space-y-4">
        <input 
          className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-yellow-500 transition-all"
          placeholder="Business Name"
          required
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
        />
        <input 
          className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-yellow-500 transition-all"
          placeholder="Location (City)"
          required
          value={formData.loc}
          onChange={e => setFormData({...formData, loc: e.target.value})}
        />
        <input 
          className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-yellow-500 transition-all"
          placeholder="Email Address"
          type="email"
          required
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
        />
        <button 
          disabled={loading}
          className="w-full bg-yellow-500 text-slate-950 py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-yellow-400"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
          RUN ENTITY SCAN
        </button>
        {status === 'success' && <p className="text-green-400 text-center font-bold">✅ Audit Initiated! Check your inbox.</p>}
      </form>
    </div>
  );
}
