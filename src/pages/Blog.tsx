import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, BrainCircuit, Globe } from 'lucide-react';

export const blogPosts = [
  {
    id: "generative-engine-optimization-2026",
    category: "AI Architecture",
    title: "The Architecture of Generative Engine Optimization (GEO)",
    excerpt: "Why traditional SEO is obsolete, and how to structure your digital content for LLM ingestion and zero-click search dominance.",
    date: "Feb 2026",
    readTime: "6 min read",
    icon: <BrainCircuit size={24} className="text-yellow-500" />
  },
  {
    id: "saas-metrics-revenue-retention",
    category: "B2B SaaS Strategy",
    title: "Operationalizing SaaS Metrics: From TOFU to NRR",
    excerpt: "Stop paying for zero-intent traffic. How to refine search intent modeling to double your Lead-to-MQL conversion rate.",
    date: "Feb 2026",
    readTime: "8 min read",
    icon: <Globe size={24} className="text-yellow-500" />
  },
  {
    id: "schema-markup-aeo",
    category: "Technical AEO",
    title: "The Structural Imperative: Schema.org for LLM Parsing",
    excerpt: "LLMs are blind crawlers. Discover the exact JSON-LD frameworks required to feed the Google Knowledge Graph.",
    date: "Jan 2026",
    readTime: "5 min read",
    icon: <BookOpen size={24} className="text-yellow-500" />
  }
];

export const Blog = () => {
  return (
    <div className="container mx-auto px-6 py-12 animate-fade-in min-h-screen">
      <div className="max-w-4xl mx-auto mb-20 text-center">
        <span className="text-yellow-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">
          Strategic Intel
        </span>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-white leading-none">
          Intelligence <span className="text-yellow-500">Hub</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
          The tactical blueprints, linguistic calibrations, and structural alignments required to dominate digital discoverability in 2026.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {blogPosts.map((post) => (
          <Link 
            key={post.id} 
            to={`/blog/${post.id}`}
            className="group flex flex-col bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 hover:border-yellow-500/50 transition-all shadow-lg hover:shadow-yellow-500/10"
          >
            <div className="mb-6 bg-black w-14 h-14 rounded-2xl flex items-center justify-center border border-gray-800 group-hover:scale-110 transition-transform">
              {post.icon}
            </div>
            
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3 block">
              {post.category}
            </span>
            
            <h2 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-yellow-500 transition-colors">
              {post.title}
            </h2>
            
            <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-gray-800/50 mt-auto">
              <span className="text-xs text-gray-600 font-medium">
                {post.date} • {post.readTime}
              </span>
              <span className="text-yellow-500 flex items-center gap-1 text-xs font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                Read Protocol <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
