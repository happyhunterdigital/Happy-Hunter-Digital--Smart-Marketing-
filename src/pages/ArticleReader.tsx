import { useParams, Link } from 'react-router-dom';
import { ARTICLES } from '../constants/articles';
import { ArrowLeft, Zap, Calendar, Shield } from 'lucide-react';

export default function ArticleReader() {
  const { id } = useParams();
  const article = ARTICLES.find(a => a.id === id);

  if (!article) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Entity Not Found</h2>
          <Link to="/earned-media" className="text-yellow-500 underline uppercase text-xs font-black">Back to Hub</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
      <Link to="/earned-media" className="inline-flex items-center gap-2 text-slate-500 hover:text-yellow-500 transition-colors uppercase text-[10px] font-black tracking-widest mb-12">
        <ArrowLeft size={14} /> Back to Knowledge Hub
      </Link>

      <header className="mb-16 space-y-6">
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-yellow-500">
          <span className="bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">{article.category}</span>
          <span className="flex items-center gap-2 text-slate-600"><Calendar size={12}/> {article.date}</span>
        </div>
        <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.95]">
          {article.title}
        </h1>
        <p className="text-xl text-slate-400 italic leading-relaxed border-l-4 border-yellow-500/30 pl-8">
          {article.summary}
        </p>
      </header>

      <article 
        className="prose prose-invert prose-yellow max-w-none prose-h3:uppercase prose-h3:tracking-tighter prose-h3:text-2xl prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <div className="mt-32 p-10 border border-slate-900 rounded-[2.5rem] bg-slate-900/40 text-center">
        <Shield className="mx-auto text-yellow-500 mb-6" size={40} />
        <h3 className="text-3xl font-black uppercase mb-4">Apply this protocol to <span className="text-yellow-500">your business</span></h3>
        <p className="text-slate-500 mb-10 max-w-md mx-auto italic font-medium">Stop being a 'Ghost' to the algorithm. Start your 2026 Readiness Scan now.</p>
        <Link to="/audit" className="inline-flex items-center gap-3 bg-yellow-500 text-slate-950 px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all">
          RUN ENTITY SCAN <Zap size={20} fill="currentColor" />
        </Link>
      </div>
    </div>
  );
}
