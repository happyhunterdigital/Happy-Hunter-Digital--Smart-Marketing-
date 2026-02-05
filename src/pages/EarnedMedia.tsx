import { ARTICLES } from '../constants/articles';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Zap, ArrowRight } from 'lucide-react';

export default function EarnedMedia() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-20 space-y-4">
        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter">
          Earned <span className="text-yellow-500">Media</span>
        </h2>
        <p className="text-slate-500 text-lg md:text-xl italic max-w-2xl leading-relaxed">
          The Proof of the Protocol. Explore the real-world impact of Digital Entity Management.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ARTICLES.map((art) => (
          <Link to={`/article/${art.id}`} key={art.id} className="group p-10 border border-slate-900 rounded-[2.5rem] bg-slate-900/20 hover:border-yellow-500/30 transition-all relative flex flex-col">
            <div className="flex justify-between items-start mb-12">
              <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                {art.category}
              </span>
              <BookOpen size={20} className="text-slate-800 group-hover:text-yellow-500 transition-colors" />
            </div>
            
            <h3 className="text-2xl font-bold mb-4 leading-tight group-hover:text-white transition-colors">
              {art.title}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">
              {art.summary}
            </p>

            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-700">
                <CheckCircle size={12} className="text-yellow-500" />
                <span>{art.tag}</span>
              </div>
              <ArrowRight size={16} className="text-yellow-500 transform translate-x-0 group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
