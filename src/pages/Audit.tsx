import { useState } from 'react';
import { hunterAI } from '../lib/gemini';
import { Search, Loader2, AlertCircle } from 'lucide-react';

export default function Audit() {
  const [bizName, setBizName] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function runAudit() {
    if (!bizName || loading) return;
    setLoading(true);
    setResult("");
    
    try {
      const model = hunterAI;
      const prompt = `Perform a Digital Entity Audit for "${bizName}". 
      1. Identify 3 critical trust gaps.
      2. Rate their likely "AI Visibility" score from 0-100.
      3. Provide a 1-sentence survival strategy.
      Format: High-authority, professional, and strategic. Refer to them as an 'Invisible Entity' if they are an SME.`;
      
      const res = await model.generateContent(prompt);
      setResult(res.response.text());
    } catch (e) {
      setResult("SIGNAL INTERRUPTED: The AI engine could not verify this entity. Please book a manual audit at https://calendly.com/motsumitl/30min");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-1 rounded-full mb-6">
          <AlertCircle size={14} className="text-yellow-500" />
          <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Entity Scan Protocol Active</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">2026 <span className="text-yellow-500">Audit</span></h2>
        <p className="text-slate-500 italic">Are you a 'Ghost' to the algorithm? Let the ecosystem find your gaps.</p>
      </div>

      <div className="relative group max-w-2xl mx-auto mb-16">
        <input 
          className="w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl focus:ring-2 focus:ring-yellow-500/50 outline-none transition-all text-lg placeholder:text-slate-700"
          placeholder="Business Name & Location..."
          value={bizName}
          onChange={(e) => setBizName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && runAudit()}
        />
        <button 
          onClick={runAudit}
          disabled={loading}
          className="absolute right-3 top-3 bottom-3 bg-yellow-500 text-slate-950 px-8 rounded-xl font-black hover:bg-yellow-400 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={20}/> : <Search size={20}/>}
          <span className="hidden md:inline">RUN SCAN</span>
        </button>
      </div>

      {result && (
        <div className="p-10 border border-slate-800 rounded-[2.5rem] bg-slate-900/30 animate-in fade-in slide-in-from-bottom-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse" />
            <h3 className="text-yellow-500 font-black uppercase tracking-[0.2em] text-[10px]">Ecosystem Analysis Result</h3>
          </div>
          <div className="prose prose-invert prose-yellow text-slate-300 max-w-none leading-relaxed whitespace-pre-wrap font-medium">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
