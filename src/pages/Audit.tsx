import { useState } from 'react';
import { hunterAI } from '../lib/gemini';
import { Search, Loader2 } from 'lucide-react';

export default function Audit() {
  const [bizName, setBizName] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function runAudit() {
    if (!bizName || loading) return;
    setLoading(true);
    try {
      const res = await hunterAI.generateContent(`Perform a Digital Entity Audit for "${bizName}". Identify 3 trust gaps and an AI Visibility score.`);
      setResult(res.response.text());
    } catch (e) { setResult("Error scanning. Try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="pt-32 px-6 max-w-4xl mx-auto min-h-screen">
      <h2 className="text-5xl font-black text-center mb-12 uppercase tracking-tighter">2026 Audit</h2>
      <div className="flex gap-4 mb-12">
        <input className="flex-1 bg-slate-900 border border-slate-800 p-5 rounded-2xl outline-none" placeholder="Business Name..." value={bizName} onChange={(e) => setBizName(e.target.value)} />
        <button onClick={runAudit} className="bg-yellow-500 text-slate-950 px-8 rounded-2xl font-black">
          {loading ? <Loader2 className="animate-spin" /> : <Search />}
        </button>
      </div>
      {result && <div className="p-8 border border-slate-800 bg-slate-900/30 rounded-3xl text-slate-300 text-sm whitespace-pre-wrap">{result}</div>}
    </div>
  );
}
