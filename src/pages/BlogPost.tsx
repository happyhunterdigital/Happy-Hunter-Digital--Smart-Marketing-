import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, CheckCircle2 } from 'lucide-react';
import { blogPosts } from './Blog';

export const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-white text-2xl font-black uppercase">
        Intelligence File Not Found.
      </div>
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen pb-20 animate-fade-in">
      
      {/* Article Header */}
      <header className="border-b border-gray-800 bg-[#0a0a0a] pt-12 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-yellow-500 transition-colors text-xs font-bold uppercase tracking-widest mb-10">
            <ArrowLeft size={16} /> Back to Hub
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest rounded-full">
              {post.category}
            </span>
            <span className="text-gray-500 text-xs font-medium">{post.readTime}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 tracking-tighter">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-400 italic font-medium leading-relaxed border-l-4 border-yellow-500 pl-6">
            {post.excerpt}
          </p>
        </div>
      </header>

      {/* Article Body (Simulated Content) */}
      <article className="container mx-auto px-6 max-w-3xl py-16 text-gray-300 text-lg leading-relaxed space-y-8 font-serif">
        
        <p>
          The digital marketing landscape of 2026 represents a profound architectural and psychological departure from the heuristic, keyword-driven search models that dominated the previous two decades. 
        </p>

        <h2 className="text-3xl font-black text-white tracking-tight mt-12 mb-6 font-sans">
          The Structural Imperative of AEO
        </h2>

        <p>
          Instead of relying solely on frozen, historical training data, modern engines utilize Retrieval-Augmented Generation (RAG). If an agency's digital properties are not explicitly formatted for LLM retrieval, the brand effectively vanishes from decision-maker shortlists.
        </p>

        <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-2xl my-10">
          <h3 className="text-yellow-500 font-bold uppercase text-xs tracking-widest mb-4 font-sans flex items-center gap-2">
            <CheckCircle2 size={16} /> Critical Takeaway
          </h3>
          <p className="text-white font-medium text-base font-sans">
            Growth implies increasing revenue at the direct expense of adding proportional resources. Scaling denotes the ability to increase revenue exponentially while costs rise only incrementally.
          </p>
        </div>

        <h2 className="text-3xl font-black text-white tracking-tight mt-12 mb-6 font-sans">
          The 3-Layer Execution Matrix
        </h2>

        <ul className="space-y-6 list-none pl-0">
          <li className="flex gap-4">
            <span className="text-yellow-500 font-black text-xl font-sans">01</span>
            <div>
              <strong className="text-white block mb-1 font-sans">Structured Content Q&A</strong>
              Evergreen content must be broken down into concise Question-and-Answer blocks maintained under 300 characters.
            </div>
          </li>
          <li className="flex gap-4">
            <span className="text-yellow-500 font-black text-xl font-sans">02</span>
            <div>
              <strong className="text-white block mb-1 font-sans">Evidence-Based Credibility</strong>
              LLMs heavily prioritize recent, verifiable data. Content must avoid abstract principles entirely in favor of specific numbers (e.g., LTV:CAC ratios).
            </div>
          </li>
          <li className="flex gap-4">
            <span className="text-yellow-500 font-black text-xl font-sans">03</span>
            <div>
              <strong className="text-white block mb-1 font-sans">Schema JSON-LD Injection</strong>
              Explicitly labeling specific content elements so the machine knows exactly what corporate entity is speaking.
            </div>
          </li>
        </ul>

      </article>

      {/* Footer CTA */}
      <div className="container mx-auto px-6 max-w-3xl border-t border-gray-800 pt-12 text-center">
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Ready to dominate AI Search?</h3>
        <p className="text-gray-400 mb-8">Stop paying for zero-intent traffic. Deploy our protocol today.</p>
        <Link to="/audit" className="inline-block bg-yellow-500 text-black px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-colors">
          Run Entity Scan
        </Link>
      </div>

    </div>
  );
};
