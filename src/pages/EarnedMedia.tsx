import { Target, Zap, Globe, ShieldCheck } from 'lucide-react';

const CASE_STUDIES = [
  {
    client: "Skubalisto",
    industry: "Art & Muralism",
    problem: "Invisible online despite global physical fame.",
    fix: "Entity Synchronization & Knowledge Graph injection.",
    result: "Dominant AI search ranking for 'South African Muralists'."
  },
  {
    client: "Integrated Wellth",
    industry: "Financial Services",
    problem: "Ghost effect in competitive local search.",
    fix: "Google Business Profile Mirror Rule deployment.",
    result: "300% increase in inbound digital inquiries."
  }
];

export const EarnedMedia = () => (
  <div className="container mx-auto px-6 py-20">
    <div className="max-w-4xl">
      <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-10">
        Earned <span className="text-brand-yellow">Media</span>
      </h2>
      <p className="text-gray-400 text-xl italic mb-20 border-l-4 border-brand-yellow pl-6">
        "Standard marketing creates noise. Our protocol creates signals."
      </p>

      <div className="grid gap-12">
        {CASE_STUDIES.map((study, i) => (
          <div key={i} className="group p-8 bg-gray-900/40 border border-white/5 rounded-3xl hover:border-brand-yellow/30 transition-all">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-3xl font-black text-brand-yellow uppercase tracking-tighter">{study.client}</h3>
              <Globe className="text-gray-700" size={20}/>
            </div>
            <div className="space-y-4 text-sm">
              <p><span className="text-gray-500 uppercase font-bold text-[10px] tracking-widest block mb-1">Vulnerability</span> {study.problem}</p>
              <p><span className="text-gray-500 uppercase font-bold text-[10px] tracking-widest block mb-1">The Protocol</span> {study.fix}</p>
              <div className="p-4 bg-brand-yellow/5 border border-brand-yellow/20 rounded-xl mt-6">
                <p className="text-brand-yellow font-bold flex items-center gap-2 italic">
                  <ShieldCheck size={16}/> Outcome: {study.result}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
