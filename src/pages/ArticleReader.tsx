import { useParams, Link } from 'react-router-dom';
import { ARTICLES } from '../constants/articles';
import { ArrowLeft, ExternalLink, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';

export default function ArticleReader() {
  const { id } = useParams();
  const study = ARTICLES.find(a => a.id === id);

  if (!study) return <div className="h-screen flex items-center justify-center font-black uppercase">Entity Lost.</div>;

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen">
      <Link to="/earned-media" className="inline-flex items-center gap-2 text-slate-700 hover:text-yellow-500 transition-all uppercase text-[10px] font-black tracking-[0.3em] mb-16">
        <ArrowLeft size={14} /> Back to Hub
      </Link>

      <div className="grid lg:grid-cols-3 gap-20">
        <div className="lg:col-span-2 space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <span className="text-yellow-500 font-black uppercase tracking-[0.2em] text-[10px] bg-yellow-500/10 px-4 py-1 rounded-full border border-yellow-500/20">{study.category}</span>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-white">
              {study.clientName}
            </h1>
            <p className="text-2xl text-slate-400 italic font-medium leading-tight">
              {study.hookTitle}
            </p>
          </div>

          {/* Analysis Blocks */}
          <div className="space-y-16 border-t border-slate-900 pt-16">
            <section>
              <h3 className="text-yellow-500 font-black uppercase text-xs tracking-[0.4em] mb-6">01. The Problem</h3>
              <p className="text-slate-300 text-lg leading-relaxed font-medium">{study.problem}</p>
            </section>
            <section>
              <h3 className="text-yellow-500 font-black uppercase text-xs tracking-[0.4em] mb-6">02. The Fix</h3>
              <p className="text-slate-300 text-lg leading-relaxed font-medium">{study.fix}</p>
            </section>
            <section>
              <h3 className="text-yellow-500 font-black uppercase text-xs tracking-[0.4em] mb-6">03. The Result</h3>
              <p className="text-slate-300 text-lg leading-relaxed font-medium">{study.result}</p>
            </section>
            <div className="p-10 bg-slate-900/40 border border-slate-800 rounded-[3rem] italic">
              <h3 className="text-white font-black uppercase text-xs mb-4">Strategic Takeaway for Entrepreneurs</h3>
              <p className="text-slate-400">"{study.takeaway}"</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="p-10 border border-slate-900 rounded-[3rem] bg-slate-900/20 sticky top-32">
            <a href={study.clientWebsite} target="_blank" rel="noreferrer" className="block mb-12 group">
               <img src={study.clientLogo} className="h-16 w-auto object-contain mb-4 grayscale group-hover:grayscale-0 transition-all" alt="client" />
               <div className="flex items-center gap-2 text-slate-600 group-hover:text-yellow-500 transition-colors text-[10px] font-black uppercase">
                 Visit Website <ExternalLink size={12} />
               </div>
            </a>

            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-8 flex items-center gap-2">
              <Zap size={14} fill="currentColor" className="text-yellow-500"/> Protocol Wins
            </h4>
            <div className="space-y-6">
              {study.resultsList.map((res, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-yellow-500 shrink-0" />
                  <p className="text-white font-bold text-xs uppercase tracking-tight leading-tight">{res}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-800">
               <Link to="/audit" className="w-full bg-yellow-500 text-slate-950 p-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                 RUN YOUR ENTITY SCAN
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
