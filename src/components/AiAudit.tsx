import { useState } from 'react';
import { db, callHunterAI } from '../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Search, Loader2, ShieldCheck } from 'lucide-react';

export default function AiAudit() {
  const [formData, setFormData] = useState({ name: '', loc: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      // 1. GENERATE AI AUDIT
      const prompt = `Analyze the business "${formData.name}" in "${formData.loc}". Identify 3 critical trust gaps for this South African niche. Assign an 'Invisibility Score' from 0-100. Tone: Strategic Expert.`;
      const aiResponse = await callHunterAI(prompt);
      setResult(aiResponse);

      // 2. SAVE LEAD TO FIREBASE
      if (db) {
        await addDoc(collection(db, "mail"), {
          to: formData.email,
          businessName: formData.name,
          location: formData.loc,
          status: "new",
          timestamp: serverTimestamp(),
          analysis: aiResponse
        });
      }
    } catch (error) {
      setResult("Audit failed to save, but here is your analysis: " + result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-4xl mx-auto my-20">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Entity <span className="text-yellow-500">Scan</span></h2>
        <p className="text-slate-500 italic mt-2 text-sm">Reveal the gaps in your digital architecture.</p>
      </div>
      
      <form onSubmit={runAudit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-yellow-500" placeholder="Business Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-yellow-500" placeholder="City" required value={formData.loc} onChange={e => setFormData({...formData, loc: e.target.value})} />
        </div>
        <input className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-yellow-500" placeholder="Email Address" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        
        <button disabled={loading} className="w-full bg-yellow-500 text-slate-950 py-5 rounded-xl font-black flex items-center justify-center gap-3 hover:bg-yellow-400 disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
          INITIATE SCAN
        </button>
      </form>

      {result && (
        <div className="mt-10 p-8 border border-slate-800 bg-slate-950/50 rounded-3xl animate-in fade-in zoom-in">
          <div className="flex items-center gap-2 mb-6 text-yellow-500">
            <ShieldCheck size={18}/> <span className="text-[10px] font-black uppercase tracking-widest">Protocol Analysis Result</span>
          </div>
          <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">{result}</div>
        </div>
      )}
    </div>
  );
}
