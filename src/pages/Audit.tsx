import { useState } from 'react';
import { hunterAI } from '../lib/gemini';
import { Search, Loader2 } from 'lucide-react';

export default function Audit() {
  const [bizName, setBizName] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function runAudit() {
    if (!bizName) return;
    setLoading(true);
    try {
      const model = hunterAI;
      const prompt = `Analyze the digital visibility of a business named "${bizName}". 
      Identify 3 critical gaps they likely have in their Digital Entity and suggest a survival strategy. 
      Keep it brief and high-authority.`;
      const res = await model.generateContent(prompt);
      setResult(res.response.text());
    } catch (e) {
      setResult("The scan was interrupted. Please try again or book a manual audit.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 text-yellow-500">2026 Readiness Audit</h2>
        <p className="text-slate-400">Query the ecosystem to see what you are missing online.</p>
      </div>

      <div className="flex gap-4 mb-12">
        <input 
          className="flex-1 bg-slate-900 border border-slate-800 p-4 rounded-xl focus:ring-1 focus:ring-yellow-500 outline-none"
          placeholder="Enter Business Name (e.g. Joe's Plumbing Pretoria)"
          value={bizName}
          onChange={(e) => setBizName(e.target.value)}
        />
        <button 
          onClick={runAudit}
          disabled={loading}
          className="bg-yellow-500 text-slate-950 px-8 rounded-xl font-bold flex items-center gap-2 hover:bg-yellow-400 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin"/> : <Search size={20}/>}
          <span>SCAN</span>
        </button>
      </div>

      {result && (
        <div className="p-8 border border-yellow-500/30 rounded-3xl bg-slate-900/50 animate-in fade-in slide-in-from-bottom-5">
          <h3 className="text-yellow-500 font-bold mb-4 uppercase tracking-widest text-xs">Analysis Result</h3>
          <div className="prose prose-invert prose-yellow text-sm max-w-none leading-relaxed whitespace-pre-wrap text-slate-300">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
