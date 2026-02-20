import { Zap, ShieldAlert, Cpu } from 'lucide-react';

const SERVICES = [
  {
    title: "The Trust Anchor",
    desc: "Google Business Profile optimization using the Mirror Rule protocol.",
    icon: <ShieldAlert size={40}/>
  },
  {
    title: "The AI Megaphone",
    desc: "Structuring your data so AI assistants recommend you as the #1 answer.",
    icon: <Cpu size={40}/>
  },
  {
    title: "The Revenue Brain",
    desc: "Automated lead capture funnels that qualify prospects 24/7.",
    icon: <Zap size={40}/>
  }
];

export const CoreServices = () => (
  <div className="container mx-auto px-6 py-20">
    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-20 text-center">
      The <span className="text-brand-yellow">Protocol</span>
    </h2>
    <div className="grid md:grid-cols-3 gap-8">
      {SERVICES.map((s, i) => (
        <div key={i} className="p-10 bg-gray-900/50 border border-white/5 rounded-[2rem] text-center hover:border-brand-yellow/40 transition-all group">
          <div className="text-brand-yellow mb-8 flex justify-center group-hover:scale-110 transition-transform">{s.icon}</div>
          <h3 className="text-2xl font-black uppercase mb-4">{s.title}</h3>
          <p className="text-gray-500 leading-relaxed">{s.desc}</p>
        </div>
      ))}
    </div>
  </div>
);
