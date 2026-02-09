import { ARTICLES } from '../constants/articles';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Zap, BookOpen } from 'lucide-react';

export default function EarnedMedia() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-24 space-y-4">
        <span className="text-yellow-500 font-black uppercase tracking-[0.4em] text-[10px]">Strategic Proof</span>
        <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none">
          Earned <span className="text-yellow-500">Media</span>
        </h2>
        <p className="text-slate-500 text-lg md:text-xl italic font-medium max-w-2xl leading-relaxed">
          Real-world data on how the <span className="brand-name text-white lowercase text-2xl">happyhunterdigital</span> protocol transforms invisible businesses into citable authorities.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {ARTICLES.map((study) => (
          <Link to={`/article/${study.id}`} key={study.id} className="group flex flex-col bg-slate-900/20 border border-slate-900 rounded-[3rem] p-10 hover:border-yellow-500/30 transition-all relative overflow-hidden">
            <div className="flex justify-between items-start mb-12">
              <div className="bg-yellow-500/10 border border-yellow-500/20 px-4 py-1 rounded-full">
                <span className="text-yellow-500 text-[9px] font-black uppercase tracking-widest">{study.category}</span>
              </div>
              <ArrowUpRight size={24} className="text-slate-800 group-hover:text-yellow-500 transition-colors" />
            </div>

            <div className="mb-10 h-16">
              <img src={study.clientLogo} alt={study.clientName} className="h-full w-auto object-contain grayscale group-hover:grayscale-0 transition-all" />
            </div>
            
            <h3 className="text-3xl font-black text-white leading-none uppercase tracking-tighter mb-6 group-hover:text-yellow-500 transition-colors">
              {study.hookTitle}
            </h3>
            
            <p className="text-slate-500 text-sm leading-relaxed mb-10 italic">
              {study.summary}
            </p>

            <div className="mt-auto pt-8 border-t border-slate-800 flex items-center justify-between">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Protocol Results Attached</span>
               <div className="flex items-center gap-2 text-white font-black uppercase text-[10px] tracking-widest">
                 Read Full Case Study <BookOpen size={14} className="text-yellow-500" />
               </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
