// src/pages/Blog.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, BrainCircuit, Globe, Target, Database, Search, ShieldCheck, Zap } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';

export const blogPosts = [
  {
    id: "playbook",
    category: "2026 Playbook",
    title: "The 2026 Digital Marketing Playbook",
    excerpt: "Your Competitors Are Already Using These Strategies. Are You? The complete playbook for AI-powered personalization, conversational commerce, and the trust-driven future.",
    query: "What are the essential digital marketing strategies for 2026?",
    date: "April 2026",
    readTime: "15 min read",
    icon: <BookOpen size={24} className="text-yellow-500" />,
    isPlaybook: true
  },
  {
    id: "local-search-2026", // NEW CASE STUDY
    category: "Local Search",
    title: "The Evolution of Local Search in 2026: Entity Alignment & Authentic Video",
    excerpt: "Local search is governed by dynamic Entity Authority, not static keywords. Google now prioritizes high-velocity social signals and raw, owner-shot video over traditional citations.",
    query: "How does Google's local Map Pack work in 2026?",
    date: "May 2026",
    readTime: "8 min read",
    icon: <Target size={24} className="text-yellow-500" />
  },
  {
    id: "beyond-the-blue-link",
    category: "Entity Architecture",
    title: "Beyond the Blue Link: Why Ranking on Page One is Obsolete in 2026",
    excerpt: "Static websites are liabilities. We reframe your website as an 'AI-ready digital asset' and discuss the necessity of RAG-ready formatting for LLM ingestion to prevent invisibility.",
    query: "How do I build a website that works with AI search engines like ChatGPT?",
    date: "Mar 2026",
    readTime: "5 min read",
    icon: <Database size={24} className="text-yellow-500" />
  },
  {
    id: "entity-architect",
    category: "Trust Synchronization",
    title: "Your Google Business Profile is NOT Enough: The Critical Step to Becoming an AI-Verified Entity",
    excerpt: "87% of SMEs are invisible without verified status. Focus on the actionable steps of claiming and verifying a GBP. Frame Trust Synchronization as the foundational layer of becoming an entity.",
    query: "I'm a local business in Pretoria. How do I make sure people can find me online?",
    date: "Mar 2026",
    readTime: "4 min read",
    icon: <ShieldCheck size={24} className="text-yellow-500" />
  },
  {
    id: "ai-megaphone",
    category: "AI Visibility (AEO)",
    title: "Confused AI = Invisible Business: Dominating Zero-Click Search Strategies for 2026",
    excerpt: "Traditional SEO is dead. Modern Generative Engine Optimization (GEO) focuses on being recommended in conversational answers. AI-referred traffic is growing exponentially (+527%).",
    query: "Why isn't my business showing up in Google's AI Overviews?",
    date: "Feb 2026",
    readTime: "6 min read",
    icon: <Search size={24} className="text-yellow-500" />
  },
  {
    id: "revenue-brain",
    category: "Agentic Revenue",
    title: "The Revenue Brain: Automating Lead Qualification with Agentic AI for South African SMEs",
    excerpt: "Intelligent AI Receptionists that qualify leads 24/7. See how a Sandton financial advisor converted after-hours inquiries into booked consultations, increasing qualified leads by 25%.",
    query: "Can AI automate my sales process and book appointments for me?",
    date: "Feb 2026",
    readTime: "5 min read",
    icon: <Zap size={24} className="text-yellow-500" />
  },
  {
    id: "synthesis",
    category: "GTM Strategy",
    title: "Synthesis: A Comprehensive 2026 Go-to-Market Strategy",
    excerpt: "How the Trust Anchor, AI Megaphone, and Revenue Brain converge into a self-reinforcing revenue loop.",
    query: "What is the best digital marketing strategy for 2026?",
    date: "Jan 2026",
    readTime: "7 min read",
    icon: <Globe size={24} className="text-yellow-500" />
  }
];

export const Blog = () => {
  return (
    <div className="container mx-auto px-6 py-12 animate-fade-in min-h-screen">
      <PageMeta
        title="Smart News | Happy Hunter Digital"
        description="Practical guides on getting found online, AI search visibility, and growing a South African small business — no jargon."
        path="/smart-news"
      />
      <div className="max-w-4xl mx-auto mb-20 text-center">
        <span className="text-yellow-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">
          Smart News
        </span>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-white leading-none">
          Smart <span className="text-yellow-500">News</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
          Practical guides on getting found online and growing your business — no jargon, just what actually works.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {blogPosts.map((post) => (
          <Link 
            key={post.id} 
            to={post.isPlaybook ? `/smart-news/playbook` : `/blog/${post.id}`} 
            className="group flex flex-col bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 hover:border-yellow-500/50 transition-all shadow-lg hover:shadow-yellow-500/10"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="bg-black w-14 h-14 rounded-2xl flex items-center justify-center border border-gray-800 group-hover:scale-110 transition-transform">
                {post.icon}
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                {post.category}
              </span>
            </div>
            
            <p className="text-[10px] font-bold text-yellow-500 mb-3 uppercase tracking-wider">
              Query: "{post.query}"
            </p>
            
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

      <div className="max-w-4xl mx-auto mt-24 bg-gradient-to-br from-[#111827] to-[#0a0a0a] border-2 border-yellow-500/50 rounded-3xl p-10 md:p-16 text-center shadow-[0_0_50px_rgba(234,179,8,0.15)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
        <BrainCircuit size={48} className="text-yellow-500 mx-auto mb-6" />
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
          The State of AI Visibility <br/><span className="text-yellow-500">for Gauteng SMEs 2026</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          Our latest localized data report reveals the exact financial impact of the "Ghost Effect." We analyzed 500+ local businesses to prove why Answer Engine Optimization (AEO) is no longer optional.
        </p>
        <Link to="/audit" className="inline-block bg-yellow-500 text-black px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all">
          Request the Data Report
        </Link>
      </div>
    </div>
  );
};
