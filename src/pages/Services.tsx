import { ShieldCheck, Cpu, BrainCircuit } from 'lucide-react';

export default function Services() {
  const services = [
    { title: "Trust Anchor", icon: <ShieldCheck size={32}/>, desc: "GMB Verification & Entity Health." },
    { title: "AI Megaphone", icon: <Cpu size={32}/>, desc: "AEO Optimization for LLMs." },
    { title: "Revenue Brain", icon: <BrainCircuit size={32}/>, desc: "24/7 Agentic Automation." }
  ];
  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto min-h-screen">
      <h2 className="text-5xl font-black text-center mb-20 uppercase tracking-tighter">The Ecosystem</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {services.map((s, i) => (
          <div key={i} className="p-10 border border-slate-900 bg-slate-900/20 rounded-3xl">
            <div className="text-yellow-500 mb-6">{s.icon}</div>
            <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
            <p className="text-slate-400">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
