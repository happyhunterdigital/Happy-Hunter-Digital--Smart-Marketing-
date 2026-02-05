import { useState } from 'react';
import { callHunterAI } from '../firebaseConfig'; 
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
      const prompt = `Perform a Digital Entity Audit for "${bizName}". Identify 3 Trust Gaps. Rate likely "AI Visibility" from 0-100. Provide a 1-sentence survival strategy. Tone: Strategic Expert.`;
      const responseText = await callHunterAI(prompt);
      setResult(responseText);
    } catch (e) {
      setResult("SIGNAL INTERRUPTED: Handshake failed. Please book a call at https://calendly.com/motsumitl/30min");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen text-center">
      <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-12">Entity <span className="text-yellow-500">Scan</span></h2>
      <div className="relative max-w-2xl mx-auto mb-16">
        <input className="w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl outline-none focus:border-yellow-500 transition-all text-lg" placeholder="Business Name & City..." value={bizName} onChange={(e) => setBizName(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && runAudit()} />
        <button onClick={runAudit} disabled={loading} className="absolute right-3 top-3 bottom-3 bg-yellow-500 text-slate-950 px-8 rounded-xl font-black flex items-center gap-2">
          {loading ? <Loader2 className="animate-spin" /> : <Search />}
          <span>SCAN</span>
        </button>
      </div>
      {result && (
        <div className="max-w-3xl mx-auto p-10 border border-slate-800 rounded-[2.5rem] bg-slate-900/40 text-left animate-in zoom-in fade-in duration-500">
          <div className="flex items-center gap-3 mb-8 text-yellow-500">
            <ShieldCheck size={20} />
            <h3 className="font-black uppercase tracking-widest text-[10px]">Strategic Analysis Protocol</h3>
          </div>
          <div className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
