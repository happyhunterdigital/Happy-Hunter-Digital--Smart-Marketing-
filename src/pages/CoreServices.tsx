import { ShieldAlert, Zap, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CoreServices() {
  const pillars = [
    {
      title: "The Trust Anchor",
      subtitle: "(Compliance & Verification)",
      icon: <ShieldAlert className="text-yellow-500" size={40} />,
      desc: "Stop your business from being 'Evicted' by AI. We manage your Digital Passport (GMB) to ensure you pass the 2026 Smart Filter.",
    },
    {
      title: "The AI Megaphone",
      subtitle: "(LLM Optimization)",
      icon: <Cpu className="text-yellow-500" size={40} />,
      desc: "We don't write blogs; we create Data-Nodes. We teach Gemini, ChatGPT, and SGE to cite your brand as the primary authority.",
    },
    {
      title: "The Revenue Brain",
      subtitle: "(Agentic Automation)",
      icon: <Zap className="text-yellow-500" size={40} />,
      desc: "Turn your site into a 24/7 employee. Our AI agents qualify leads, book appointments, and capture revenue while you sleep.",
    }
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      {/* Hero: The Great AI Filter */}
      <div className="text-center mb-32 space-y-8">
        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-tight">
          The 2026 <br /> <span className="text-yellow-500">Survival</span> Strategy
        </h2>
        <p className="max-w-3xl mx-auto text-slate-500 text-lg md:text-xl italic">
          In a world of zero-click searches and AI assistants, traditional marketing is dead. 
          If you aren't a <span className="text-white font-bold underline">Verified Entity</span>, you are invisible.
        </p>
      </div>

      {/* The 3 Pillars */}
      <div className="grid md:grid-cols-3 gap-12 mb-32">
        {pillars.map((p, i) => (
          <div key={i} className="p-12 border border-slate-900 rounded-[3rem] bg-slate-900/20 relative group hover:border-yellow-500/30 transition-all">
            <div className="mb-8 group-hover:scale-110 transition-transform w-fit">{p.icon}</div>
            <h3 className="text-2xl font-bold mb-2">{p.title}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-yellow-500/50 mb-6">{p.subtitle}</p>
            <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Compare Table */}
      <div className="p-12 border border-slate-900 rounded-[3rem] bg-slate-950/50">
        <h3 className="text-3xl font-black uppercase mb-12 text-center">Standard Marketing vs. <span className="text-yellow-500">The Entity Protocol</span></h3>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-8 pb-6 border-b border-slate-900">
            <div className="text-slate-700 text-[10px] font-black uppercase tracking-widest">Standard SEO</div>
            <div className="text-yellow-500 text-[10px] font-black uppercase tracking-widest">Happy Hunter Protocol</div>
          </div>
          <div className="grid grid-cols-2 gap-8 py-4 items-center">
            <p className="text-slate-500 text-xs">Optimizing for Keywords</p>
            <p className="text-white text-sm font-bold flex items-center gap-2">
              <CheckCircle2 size={16} className="text-yellow-500" /> Optimizing for Entities
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 py-4 items-center">
            <p className="text-slate-500 text-xs">Chasing Backlinks</p>
            <p className="text-white text-sm font-bold flex items-center gap-2">
              <CheckCircle2 size={16} className="text-yellow-500" /> Building Semantic Authority
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 py-4 items-center">
            <p className="text-slate-500 text-xs">Waiting for Clicks</p>
            <p className="text-white text-sm font-bold flex items-center gap-2">
              <CheckCircle2 size={16} className="text-yellow-500" /> Capturing AI Citations
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="mt-32 text-center">
        <Link to="/audit" className="bg-yellow-500 text-slate-950 px-12 py-6 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-yellow-500/20 inline-flex items-center gap-3">
          SECURE YOUR ENTITY <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}
