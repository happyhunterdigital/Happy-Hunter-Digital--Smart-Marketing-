import { useState } from 'react';
import { Search, Loader2, ShieldCheck } from 'lucide-react';

export default function AiAudit() {
  const [bizName, setBizName] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runAudit() {
    if (!bizName || loading) return;
    
    setLoading(true);
    setResult("");
    setError("");

    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const prompt = `Perform a Digital Entity Audit for "${bizName}". Identify 3 Trust Gaps. Rate likely "AI Visibility" from 0-100. Provide a 1-sentence survival strategy. Tone: Strategic, aggressive.`;
      
      // This would call your actual API
      setResult(`[ENTITY ARCHITECTURE ANALYSIS]\n\nGAP 1: No verified Google Business Profile detected\nGAP 2: Inconsistent NAP data across directories  \nGAP 3: Zero AI-readable structured data\n\nAI VISIBILITY SCORE: 23/100\n\nSURVIVAL STRATEGY: Immediate Entity Recovery Protocol required - your business is INVISIBLE to Gemini and ChatGPT.\n\n[FIX] Schedule emergency GMB verification and schema markup implementation.`);
      
    } catch (e) {
      setError("SIGNAL INTERRUPTED: Handshake failed. Please book a call at hello@happyhunterdigital.com");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen text-center">
      <h2 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 sm:mb-12">
        Entity <span className="text-yellow-500">Scan</span>
      </h2>
      
      <div className="relative max-w-2xl mx-auto mb-12 sm:mb-16">
        <input
          className="w-full bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl outline-none focus:border-yellow-500 transition-all text-base sm:text-lg"
          placeholder="Business Name & City..."
          value={bizName}
          onChange={(e) => setBizName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && runAudit()}
        />
        <button
          onClick={runAudit}
          disabled={loading}
          className="absolute right-2 sm:right-3 top-2 sm:top-3 bottom-2 sm:bottom-3 bg-yellow-500 text-slate-950 px-4 sm:px-8 rounded-xl font-black flex items-center gap-2 hover:bg-yellow-400 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
          <span className="hidden sm:inline">SCAN</span>
        </button>
      </div>

      {error && (
        <div className="max-w-3xl mx-auto p-6 border border-red-500/30 rounded-2xl bg-red-500/10 text-red-400 mb-6">
          {error}
        </div>
      )}

      {result && (
        <div className="max-w-3xl mx-auto p-6 sm:p-10 border border-slate-800 rounded-[2rem] bg-slate-900/40 text-left animate-fade-in">
          <div className="flex items-center gap-3 mb-6 sm:mb-8 text-yellow-500">
            <ShieldCheck size={20} />
            <h3 className="font-black uppercase tracking-widest text-[10px] sm:text-xs">
              Strategic Analysis Protocol
            </h3>
          </div>
          <div className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-mono">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
