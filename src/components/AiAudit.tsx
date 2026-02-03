import { useState } from 'react';
import { callHunterAI } from '../firebaseConfig'; 
import { Search, Loader2, ShieldCheck, Zap } from 'lucide-react';

export default function Audit() {
  const [bizName, setBizName] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function runAudit() {
    if (!bizName || loading) return;
    setLoading(true);
    setResult("");
    
    try {
      const prompt = `Analyze the business "${bizName}". Identify 3 Trust Gaps and give an Invisibility Score. Tone: Strategic Expert.`;
      const responseText = await callHunterAI(prompt);
      setResult(responseText);
    } catch (e) {
      setResult("The AI engine requires a direct handshake. Book a call: https://calendly.com/motsumitl/30min");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter">
          Entity <span className="text-yellow-500">Scan</span>
        </h2>
        <p className="text-slate-500 font-medium italic">Query the Knowledge Graph to reveal your invisibility gaps.</p>
      </div>

      <div className="relative max-w-3xl mx-auto mb-16">
        <div className="flex gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800 focus-within:border-yellow-500 transition-colors">
          <input 
            className="flex-1 bg-transparent p-5 rounded-xl focus:outline-none text-lg placeholder:text-slate-700 text-white"
            placeholder="Business Name & City..."
            value={bizName}
            onChange={(e) => setBizName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && runAudit()}
          />
          <button 
            onClick={runAudit}
            disabled={loading}
            className="bg-yellow-500 text-slate-950 px-10 rounded-xl font-black hover:bg-yellow-400 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={24}/> : <Search size={24}/>}
            <span className="hidden md:inline uppercase tracking-widest">Initiate</span>
          </button>
        </div>
      </div>

      {result && (
        <div className="max-w-3xl mx-auto p-10 border border-slate-800 rounded-[2.5rem] bg-slate-900/40 animate-in fade-in zoom-in duration-500">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck className="text-yellow-500" size={20} />
            <h3 className="text-yellow-500 font-black uppercase tracking-[0.3em] text-[10px]">Strategic Analysis Protocol</h3>
          </div>
          <div className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
            {result}
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-600">
             <span>End of Transmission</span>
             <a href="https://calendly.com/motsumitl/30min" className="text-yellow-500 hover:underline">Book Strategy Call →</a>
          </div>
        </div>
      )}
    </div>
  );
}
