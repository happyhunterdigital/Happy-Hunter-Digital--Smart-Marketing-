import { useState } from 'react';
import { db, callHunterAI } from '../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
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
      // 1. GET AI RESPONSE FIRST
      const prompt = `Analyze the business "${bizName}" for the 2026 AI Filter. List 3 critical trust gaps and give an Invisibility Score. Tone: Expert.`;
      const aiResponse = await callHunterAI(prompt);
      setResult(aiResponse);

      // 2. SAVE TO DATABASE IN THE BACKGROUND
      if (db) {
        try {
          await addDoc(collection(db, "audits"), {
            businessName: bizName,
            timestamp: serverTimestamp(),
            analysis: aiResponse,
            status: "web_scan"
          });
        } catch (dbErr) {
          console.warn("Audit saved locally but DB sync delayed.");
        }
      }
    } catch (e) {
      setResult("SIGNAL INTERRUPTED: Connection failed. Please WhatsApp Thabo directly or book at https://calendly.com/motsumitl/30min");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen text-center">
      <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-12">Entity <span className="text-yellow-500">Scan</span></h2>
      <div className="relative max-w-2xl mx-auto mb-16 group">
        <div className="absolute -inset-1 bg-yellow-500/20 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition"></div>
        <input 
          className="relative w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl outline-none focus:border-yellow-500 transition-all text-lg text-white" 
          placeholder="Business Name & City..." 
          value={bizName} 
          onChange={(e) => setBizName(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && runAudit()} 
        />
        <button 
          onClick={runAudit} 
          disabled={loading} 
          className="absolute right-3 top-3 bottom-3 bg-yellow-500 text-slate-950 px-8 rounded-xl font-black flex items-center gap-2 hover:bg-yellow-400 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Search />}
          <span>SCAN</span>
        </button>
      </div>

      {result && (
        <div className="max-w-3xl mx-auto p-10 border border-slate-800 rounded-[2.5rem] bg-slate-900/40 text-left animate-in zoom-in fade-in duration-500">
          <div className="flex items-center gap-3 mb-8 text-yellow-500 uppercase font-black tracking-widest text-[10px]">
            <ShieldCheck size={20} />
            <span>Strategic Analysis Protocol Active</span>
          </div>
          <div className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
            {result}
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 flex justify-between items-center text-[10px] font-black text-slate-600">
            <span>Protocol v2.0 // Transmission Complete</span>
            <a href="https://calendly.com/motsumitl/30min" className="text-yellow-500 hover:underline">Fix These Gaps Now →</a>
          </div>
        </div>
      )}
    </div>
  );
}
