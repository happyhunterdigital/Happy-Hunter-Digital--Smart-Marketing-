import { ShieldCheck, Cpu, BrainCircuit, Zap, BarChart3, Users } from 'lucide-react';

export default function Services() {
  const items = [
    { title: "The Trust Anchor", desc: "Digital Identity & GMB Verification. We secure your 'Digital Passport' to prevent eviction from search results.", icon: <ShieldCheck size={32} /> },
    { title: "The AI Megaphone", desc: "Answer Engine Optimization (AEO). We structure your data so LLMs like Gemini cite YOU as the authority.", icon: <Cpu size={32} /> },
    { title: "The Revenue Brain", desc: "Agentic Automation. We deploy 24/7 intelligent agents that capture, qualify, and book leads while you sleep.", icon: <BrainCircuit size={32} /> },
    { title: "Performance Fuel", desc: "Paid Traffic Acceleration. Targeted Google & Social Ads to drive immediate high-intent traffic to your ecosystem.", icon: <Zap size={32} /> },
    { title: "The Truth Ledger", desc: "Analytics & ROI. Real-time dashboards showing exactly how your Digital Entity is performing in the eyes of the machine.", icon: <BarChart3 size={32} /> },
    { title: "Community Engineering", desc: "Social Brand Signals. We build cultural relevance that tells search algorithms your brand is trusted by humans.", icon: <Users size={32} /> }
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-7xl font-black mb-6 uppercase tracking-tighter">The Smart <span className="text-yellow-500">Ecosystem</span></h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg italic">We don't do 'Marketing'. We build Digital Entities that cannot be ignored by the 2026 Smart Filter.</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <div key={i} className="p-10 border border-slate-900 rounded-[2.5rem] bg-slate-900/20 hover:border-yellow-500/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               {item.icon}
            </div>
            <div className="text-yellow-500 mb-8 group-hover:scale-110 transition-transform w-fit">
              {item.icon}
            </div>
            <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
