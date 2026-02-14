import { Link } from 'react-router-dom';
import { Cpu, Search, AlertCircle } from 'lucide-react';

export default function AiMegaphone() {
  return (
    <div className="pt-40 pb-20 px-6 max-w-4xl mx-auto font-sans text-left">
      <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-8 text-white">
        The AI Megaphone: Answer Engine Optimization [AEO]
      </h1>

      <div className="bg-yellow-500/5 border-l-4 border-yellow-500 p-8 mb-12">
        <p className="text-slate-300 text-lg leading-relaxed">
          <b>AEO</b> is the process of structuring your brand data so that Large Language Models (LLMs) can extract it as the <b>Definitive Answer</b>. While SEO seeks clicks, the <b>AI Megaphone</b> seeks <b>Citations</b>.
        </p>
      </div>

      <div className="space-y-12">
        <h2 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-3"><AlertCircle className="text-yellow-500"/> The Zero-Click Crisis</h2>
        <p className="text-slate-400">Over 60% of searches now end without a click. If your brand is not mentioned in the AI summary, you have been effectively silenced. We use <b>Information Gain</b> strategy—creating unique, data-rich nodes that force AI models to cite you as the authority.</p>
        <Link to="/audit" className="border-2 border-slate-800 p-6 rounded-3xl text-white font-black text-center block uppercase hover:bg-slate-900 transition-all">Audit your AI Visibility</Link>
      </div>
    </div>
  );
}
