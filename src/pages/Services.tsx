import { ShieldCheck, Cpu, BrainCircuit, Zap, BarChart3, Users } from 'lucide-react';

export default function Services() {
  const items = [
    { title: "The Trust Anchor", desc: "Digital Identity & GMB Verification to prevent digital eviction.", icon: <ShieldCheck /> },
    { title: "The AI Megaphone", desc: "LLM Optimization (AEO) to make your brand the AI's first choice.", icon: <Cpu /> },
    { title: "The Revenue Brain", desc: "Automated booking and lead capture agents that work 24/7.", icon: <BrainCircuit /> },
    { title: "Performance Fuel", desc: "Paid traffic acceleration for immediate market entry.", icon: <Zap /> },
    { title: "The Truth Ledger", desc: "Real-time ROI tracking and entity health monitoring.", icon: <BarChart3 /> },
    { title: "Community Engineering", desc: "Building brand signals that AI models recognize as authority.", icon: <Users /> }
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <h2 className="text-4xl md:text-6xl font-black mb-12 text-center uppercase tracking-tighter">The Ecosystem</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <div key={i} className="p-8 border border-slate-900 rounded-3xl bg-slate-900/30 hover:bg-slate-900 transition-all group">
            <div className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform w-fit">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
