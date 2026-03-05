import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, BrainCircuit, Globe, Target, Database } from 'lucide-react';

export const blogPosts = [
  {
    id: "beyond-the-blue-link",
    category: "Strategic Intelligence",
    title: "Beyond the Blue Link: Why Ranking on Page One is Obsolete in 2026",
    excerpt: "Insights from our Digital Strategy Session with IntegratedWellth in Munyaka, Midrand. The era of scrolling through pages of blue links is officially over.",
    date: "Mar 2026",
    readTime: "5 min read",
    icon: <Target size={24} className="text-yellow-500" />
  },
  {
    id: "entity-architect",
    category: "Agency Protocol",
    title: "From Web Developer to Entity Architect",
    excerpt: "In the 2026 AI landscape, building a static website is a liability. We must own the digital truth.",
    date: "Mar 2026",
    readTime: "4 min read",
    icon: <Database size={24} className="text-yellow-500" />
  },
  {
    id: "ai-megaphone",
    category: "AI Architecture",
    title: "The Architecture of Generative Engine Optimization (GEO)",
    excerpt: "Why traditional SEO is obsolete, and how to structure your digital content for LLM ingestion and zero-click search dominance.",
    date: "Feb 2026",
    readTime: "6 min read",
    icon: <BrainCircuit size={24} className="text-yellow-500" />
  },
  {
    id: "revenue-brain",
    category: "Agentic Automation",
    title: "The Revenue Brain: Agentic Lead Automation",
    excerpt: "Replacing static contact forms with intelligent, 24/7 AI Receptionists that qualify intent.",
    date: "Feb 2026",
    readTime: "5 min read",
    icon: <Globe size={24} className="text-yellow-500" />
  },
  {
    id: "synthesis",
    category: "GTM Strategy",
    title: "Synthesis: A Comprehensive 2026 Go-to-Market Strategy",
    excerpt: "How the Trust Anchor, AI Megaphone, and Revenue Brain converge into a self-reinforcing revenue loop.",
    date: "Jan 2026",
    readTime: "7 min read",
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
