import { useState } from 'react';
import { callHunterAI } from '../firebaseConfig'; 
import { Search, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Audit() {
  const [bizName, setBizName] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function runAudit() {
    if (!bizName || loading) return;
    setLoading(true);
    setResult("");
    
    // Deeper prompt for the 2.5-Flash Reasoning Engine
    const prompt = `Perform a Digital Entity Audit for "${bizName}". Identify 3 Trust Gaps. Rate their Invisibility Score (0-100). Provide a survival strategy.`;
    const aiResponse = await callHunterAI(prompt);
    setResult(aiResponse);
    setLoading(false);
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen text-center">
      <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-12">Entity <span className="text-yellow-500">Scan</span></h2>
      <div className="relative max-w-2xl mx-auto mb-16">
        <input 
          className="w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl outline-none focus:border-yellow-500 transition-all text-lg text-white" 
          placeholder="Business Name & City..." 
          value={bizName} 
          onChange={(e) => setBizName(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && runAudit()} 
        />
        <button onClick={runAudit} disabled={loading} className="absolute right-3 top-3 bottom-3 bg-yellow-500 text-slate-950 px-8 rounded-xl font-black flex items-center gap-2 hover:bg-yellow-400 transition-all">
          {loading ? <Loader2 className="animate-spin" /> : <Search />}
          <span>SCAN</span>
        </button>
      </div>

      {result && (
        <div className={`max-w-3xl mx-auto p-10 border rounded-[2.5rem] text-left animate-in zoom-in fade-in duration-500 ${result.includes("REJECTION") || result.includes("ERROR") ? 'border-red-500 bg-red-500/10' : 'border-slate-800 bg-slate-900/40'}`}>
          <div className="flex items-center gap-3 mb-8">
            {(result.includes("REJECTION") || result.includes("ERROR")) ? <AlertCircle className="text-red-500" /> : <ShieldCheck className="text-yellow-500" />}
            <h3 className="font-black uppercase tracking-widest text-[10px]">
              {(result.includes("REJECTION") || result.includes("ERROR")) ? 'System Alert' : 'Strategic Analysis Protocol 2.5'}
            </h3>
          </div>
          <div className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
