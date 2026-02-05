import { ArrowRight, BookOpen, Globe, Zap, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EarnedMedia() {
  const articles = [
    {
      id: 1,
      category: "Case Study",
      title: "Profuse Beauty: From Page 2 to Fully Booked",
      desc: "How we used GMB Optimization and the Mirror Rule to increase beauty clinic inquiries by 310%.",
      tag: "Local Dominance"
    },
    {
      id: 2,
      category: "Strategy",
      title: "The Mirror Rule: AI Verification 101",
      desc: "Why your digital data must reflect your physical reality to survive the 2026 Smart Filter.",
      tag: "Entity Trust"
    },
    {
      id: 3,
      category: "Case Study",
      title: "Construction SME: Landing R2.5M via Trust Architecture",
      desc: "Converting high-value prospects by engineering a website designed for authority, not just looks.",
      tag: "High-Ticket Leads"
    }
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-20 space-y-4">
        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter">
          Earned <span className="text-yellow-500">Media</span>
        </h2>
        <p className="text-slate-500 text-lg md:text-xl italic max-w-2xl">
          Real results, zero fluff. Explore the protocols we use to dominate the South African digital landscape.
        </p>
      </div>

      {/* Article Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((art) => (
          <div key={art.id} className="group p-10 border border-slate-900 rounded-[2.5rem] bg-slate-900/20 hover:border-yellow-500/30 transition-all relative overflow-hidden">
            <div className="flex justify-between items-start mb-12">
              <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                {art.category}
              </span>
              <BookOpen size={20} className="text-slate-800 group-hover:text-yellow-500 transition-colors" />
            </div>
            
            <h3 className="text-2xl font-bold mb-4 leading-tight group-hover:text-yellow-500 transition-colors">
              {art.title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              {art.desc}
            </p>

            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
              <CheckCircle size={12} className="text-yellow-500" />
              <span>{art.tag}</span>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-32 p-12 border border-slate-900 rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="space-y-4 text-center md:text-left">
          <h3 className="text-3xl font-black uppercase">Ready for your own <span className="text-yellow-500">Case Study</span>?</h3>
          <p className="text-slate-500 max-w-md italic">Stop watching others dominate. Apply for an Entity Protocol audit today.</p>
        </div>
        <Link to="/audit" className="bg-yellow-500 text-slate-950 px-12 py-6 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-yellow-500/10 flex items-center gap-3">
          START SCAN <Zap size={20} fill="currentColor" />
        </Link>
      </div>
    </div>
  );
}
