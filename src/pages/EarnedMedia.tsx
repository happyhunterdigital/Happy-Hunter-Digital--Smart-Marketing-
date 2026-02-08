import { ARTICLES } from '../constants/articles';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Zap, ArrowUpRight } from 'lucide-react';

export default function EarnedMedia() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-24 space-y-4 max-w-3xl">
        <span className="text-yellow-500 font-black uppercase tracking-[0.4em] text-[10px]">Verified Intelligence</span>
        <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-white">
          Earned <span className="text-yellow-500">Media</span>
        </h2>
        <p className="text-slate-500 text-lg md:text-xl italic font-medium leading-relaxed">
          The proof of the protocol. Explore the case studies and strategic directives that define the Smart Marketing era.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ARTICLES.map((art) => (
          <Link to={`/article/${art.id}`} key={art.id} className="group p-12 border border-slate-900 rounded-[3.5rem] bg-slate-900/10 hover:border-yellow-500/30 transition-all flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start mb-16">
              <div className="text-[10px] font-black uppercase tracking-widest text-yellow-500 bg-yellow-500/5 px-4 py-1.5 rounded-full border border-yellow-500/10">
                {art.category}
              </div>
              <ArrowUpRight size={24} className="text-slate-800 group-hover:text-yellow-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
            
            <h3 className="text-3xl font-black mb-6 leading-none text-white group-hover:text-yellow-500 transition-colors uppercase tracking-tighter">
              {art.title}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-12 font-medium italic">
              {art.summary}
            </p>

            <div className="mt-auto pt-8 border-t border-slate-900/50 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">{art.tag}</span>
              <BookOpen size={16} className="text-slate-800" />
            </div>
          </Link>
        ))}
      </div>

      {/* Authority Footer CTA */}
      <div className="mt-40 p-20 border border-slate-900 rounded-[4rem] bg-gradient-to-b from-slate-900/50 to-slate-950 text-center">
         <ShieldCheck className="mx-auto text-yellow-500 mb-8" size={60} />
         <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">BECOME THE NEXT <span className="text-yellow-500">AUTHORITY</span></h3>
         <p className="text-slate-500 max-w-xl mx-auto italic font-medium mb-12">Stop being a 'Ghost Entity'. Secure your 2026 survival prognosis today.</p>
         <Link to="/audit" className="bg-yellow-500 text-slate-950 px-16 py-6 rounded-2xl font-black text-xl hover:scale-110 transition-all shadow-[0_0_50px_rgba(250,204,21,0.2)]">
            INITIATE SCAN
         </Link>
      </div>
    </div>
  );
}
