import { useState } from 'react';
import { db, callHunterAI } from '../firebaseConfig'; // CORRECT IMPORT
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Search, Loader2, ShieldCheck } from 'lucide-react';

export default function Audit() {
  const [bizName, setBizName] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function runAudit() {
    if (!bizName || loading) return;
    setLoading(true);
    setResult("");
    
    try {
      const aiResponse = await callHunterAI(`Analyze business: ${bizName}. 3 Trust Gaps. 1 Strategy.`);
      setResult(aiResponse);

      if (db) {
        await addDoc(collection(db, "audits"), {
          businessName: bizName,
          timestamp: serverTimestamp(),
          analysis: aiResponse
        });
      }
    } catch (e) {
      setResult("SIGNAL INTERRUPTED: Please book a call at https://calendly.com/motsumitl/30min");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen text-center">
      <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-12">Entity <span className="text-yellow-500">Scan</span></h2>
      <div className="relative max-w-2xl mx-auto mb-16">
        <input className="w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl outline-none focus:border-yellow-500 transition-all text-lg text-white" placeholder="Business Name & City..." value={bizName} onChange={(e) => setBizName(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && runAudit()} />
        <button onClick={runAudit} disabled={loading} className="absolute right-3 top-3 bottom-3 bg-yellow-500 text-slate-950 px-8 rounded-xl font-black flex items-center gap-2">
          {loading ? <Loader2 className="animate-spin" /> : <Search />}
          <span>SCAN</span>
        </button>
      </div>
      {result && (
        <div className="max-w-3xl mx-auto p-10 border border-slate-800 rounded-[2.5rem] bg-slate-900/40 text-left animate-in zoom-in fade-in">
          <div className="flex items-center gap-3 mb-8 text-yellow-500 uppercase font-black tracking-widest text-[10px]">
            <ShieldCheck size={20} /> <span>Strategic Analysis Protocol Active</span>
          </div>
          <div className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">{result}</div>
        </div>
      )}
    </div>
  );
}
