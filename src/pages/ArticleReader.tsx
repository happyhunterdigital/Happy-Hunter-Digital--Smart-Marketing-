import { useParams, Link } from 'react-router-dom';
import { ARTICLES } from '../constants/articles';
import { ArrowLeft, Zap, Calendar, ShieldCheck, CheckCircle2, Share2 } from 'lucide-react';

export default function ArticleReader() {
  const { id } = useParams();
  const article = ARTICLES.find(a => a.id === id);

  if (!article) return <div className="h-screen flex items-center justify-center text-white font-black uppercase">Entity Trace Lost.</div>;

  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.includes('[SECTION]')) {
        return <h3 key={i} className="text-yellow-500 font-black text-2xl uppercase tracking-tighter mt-16 mb-8 border-l-4 border-yellow-500 pl-6">{line.replace('[SECTION]', '')}</h3>;
      }
      const formatted = line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**')) return <strong key={j} className="text-white font-black underline decoration-yellow-500/30 uppercase">{part.replace(/\*\*/g, '')}</strong>;
        return part;
      });
      return <p key={i} className="mb-6 text-slate-400 leading-relaxed text-lg font-medium">{formatted}</p>;
    });
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen">
      <Link to="/earned-media" className="inline-flex items-center gap-2 text-slate-700 hover:text-yellow-500 transition-all uppercase text-[10px] font-black tracking-[0.3em] mb-16 group">
        <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back to Knowledge Hub
      </Link>

      <div className="grid lg:grid-cols-3 gap-20">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-yellow-500 mb-8">
            <span className="bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">{article.category}</span>
            <span className="flex items-center gap-2 text-slate-600"><Calendar size={12}/> {article.date}</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-white mb-10">
            {article.title}
          </h1>
          
          <p className="text-xl text-slate-500 italic leading-relaxed mb-16">
            "{article.summary}"
          </p>

          <div className="border-t border-slate-900 pt-16">
            {renderContent(article.content)}
          </div>
        </div>

        {/* Sidebar: Strategic Stats */}
        <div className="space-y-8">
          <div className="p-10 border border-slate-900 rounded-[3rem] bg-slate-900/20 sticky top-32">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
              <Zap size={14} fill="currentColor" className="text-yellow-500"/> PROTOCOL RESULTS
            </h4>
            <div className="space-y-6">
              {article.results.map((res, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-yellow-500 shrink-0 mt-1" />
                  <p className="text-white font-bold text-sm uppercase tracking-tight">{res}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-800">
               <p className="text-slate-500 text-[10px] font-bold uppercase mb-6 italic">Secure this protocol for your business:</p>
               <Link to="/audit" className="w-full bg-yellow-500 text-slate-950 p-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                 RUN ENTITY SCAN
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
