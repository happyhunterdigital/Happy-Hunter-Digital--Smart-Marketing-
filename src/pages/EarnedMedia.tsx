import { ARTICLES } from '../constants/articles';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function EarnedMedia() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen font-sans">
      <div className="mb-16 lg:mb-24 space-y-4 max-w-3xl">
        <span className="text-yellow-500 font-black uppercase text-[10px] tracking-widest">
          Strategic Proof Nodes
        </span>
        <h2 className="text-4xl sm:text-6xl lg:text-7xl xl:text-9xl font-black uppercase tracking-tighter text-white leading-none">
          Earned <span className="text-yellow-500 italic">Media</span>
        </h2>
        <p className="text-slate-500 text-base lg:text-lg xl:text-xl italic font-medium max-w-2xl leading-relaxed">
          The proof of the protocol. Verifiable data on how{' '}
          <span className="brand-name text-white lowercase text-lg lg:text-2xl">happyhunterdigital</span>{' '}
          transforms invisible entities into market authorities.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        {ARTICLES.map((study) => (
          <Link
            to={`/article/${study.id}`}
            key={study.id}
            className="group flex flex-col bg-slate-900/10 border border-slate-900 rounded-[2rem] lg:rounded-[3.5rem] p-6 lg:p-10 hover:border-yellow-500/30 transition-all relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-8 lg:mb-12">
              <div className="bg-yellow-500/10 border border-yellow-500/20 px-3 lg:px-4 py-1.5 rounded-full">
                <span className="text-yellow-500 text-[9px] font-black uppercase tracking-widest">
                  {study.category}
                </span>
              </div>
              <ArrowUpRight 
                size={24} 
                className="text-slate-800 group-hover:text-yellow-500 transition-colors" 
              />
            </div>

            <div className="mb-6 lg:mb-10 h-10 lg:h-14">
              <img 
                src={study.clientLogo} 
                alt={study.clientName} 
                className="h-full w-auto object-contain grayscale group-hover:grayscale-0 transition-all"
                loading="lazy"
              />
            </div>

            <h3 className="text-xl lg:text-2xl xl:text-3xl font-black text-white leading-[0.9] uppercase tracking-tighter mb-4 lg:mb-6 group-hover:text-yellow-500 transition-colors">
              {study.hookTitle}
            </h3>

            <p className="text-slate-500 text-sm leading-relaxed mb-8 lg:mb-10 italic font-medium line-clamp-3">
              {study.summary}
            </p>

            <div className="mt-auto pt-6 lg:pt-8 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">
                Protocol Results Attached
              </span>
              <div className="flex items-center gap-2 text-white font-black uppercase text-[10px] tracking-widest underline decoration-yellow-500 underline-offset-8 decoration-2">
                Read Analysis
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Authority Footer */}
      <div className="mt-20 lg:mt-40 p-10 lg:p-20 border border-slate-900 rounded-[3rem] lg:rounded-[4rem] bg-slate-900/10 text-center">
        <ShieldCheck className="mx-auto text-yellow-500 mb-6 lg:mb-8" size={48} />
        <h3 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tighter mb-4 lg:mb-6 leading-none">
          Become The Next <br />
          <span className="text-yellow-500">Case Study</span>
        </h3>
        <Link 
          to="/audit" 
          className="bg-yellow-500 text-slate-950 px-10 lg:px-16 py-4 lg:py-6 rounded-2xl font-black text-lg lg:text-xl hover:scale-110 transition-all shadow-2xl inline-block"
        >
          Initiate Scan
        </Link>
      </div>
    </div>
  );
}
