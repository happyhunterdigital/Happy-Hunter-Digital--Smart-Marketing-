import { useState } from 'react';
import { db, callHunterAI } from '../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Search, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Audit() {
  const [bizName, setBizName] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function runAudit() {
    if (!bizName || loading) return;
    setLoading(true);
    setResult("");
    
    // Deeper prompt for the 2.5 Engine
    const prompt = `Perform a Strategic Entity Audit for: "${bizName}". 
    1. Scan for Mirror Rule violations.
    2. Identify 3 critical trust gaps in South African local search.
    3. Calculate an AI recommendation score (0-100).
    4. Provide a 2026 survival priority.`;

    const aiResponse = await callHunterAI(prompt);
    setResult(aiResponse);

    if (db && !aiResponse.includes("ERROR")) {
      try {
        await addDoc(collection(db, "audits"), {
          businessName: bizName,
          timestamp: serverTimestamp(),
          analysis: aiResponse,
          engine: "gemini-2.5-flash"
        });
      } catch (e) { console.error("Database sync delayed."); }
    }
    setLoading(false);
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen text-center font-sans">
      <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-12">Entity <span className="text-yellow-500">Scan</span></h2>
      <div className="relative max-w-2xl mx-auto mb-16">
        <input 
          className="w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl outline-none focus:border-yellow-500 transition-all text-lg text-white" 
          placeholder="Enter Business Name & City..." 
          value={bizName} 
          onChange={(e) => setBizName(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && runAudit()} 
        />
        <button onClick={runAudit} disabled={loading} className="absolute right-3 top-3 bottom-3 bg-yellow-500 text-slate-950 px-8 rounded-xl font-black flex items-center gap-2">
          {loading ? <Loader2 className="animate-spin" /> : <Search />}
          <span>SCAN</span>
        </button>
      </div>

      {result && (
        <div className={`max-w-3xl mx-auto p-10 border rounded-[2.5rem] text-left animate-in zoom-in fade-in duration-500 ${result.includes("ERROR") ? 'border-red-500 bg-red-500/10' : 'border-slate-800 bg-slate-900/40'}`}>
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck className={result.includes("ERROR") ? 'text-red-500' : 'text-yellow-500'} />
            <h3 className="font-black uppercase tracking-widest text-[10px]">
              {result.includes("ERROR") ? 'Diagnostic Report' : 'Strategic Analysis Protocol 2.5'}
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
