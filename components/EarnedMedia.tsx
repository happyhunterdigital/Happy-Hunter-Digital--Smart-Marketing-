import React, { useState } from "react";
import { ArrowRight, BookOpen, X, Globe, Zap } from "lucide-react";

// --- DATA STRUCTURE ---
interface Article {
  id: string;
  category: "Case Study" | "Strategy" | "Press";
  title: string;
  excerpt: string;
  content: React.ReactNode;
  date: string;
  readTime: string;
}

const ARTICLES: Article[] = [
  {
    id: "1",
    category: "Case Study",
    title: "Profuse Beauty: From Hidden Gem to Local Celebrity",
    excerpt: "How we took a local beauty clinic from page 2 obscurity to being fully booked 3 weeks in advance using GMB optimization.",
    date: "Oct 12, 2025",
    readTime: "5 min read",
    content: (
      <div className="space-y-6 text-gray-800">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">The Challenge</h3>
          <p>Profuse Beauty had incredible service but zero digital footprint. Their Google Business Profile was unverified, and they were losing high-intent traffic to inferior competitors simply because they weren't visible.</p>
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">The Strategy</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Visual Overhaul:</strong> We uploaded 20+ high-quality images of their work, tagged with geo-coordinates.</li>
            <li><strong>Review Velocity:</strong> Implemented an SMS automation system that requested reviews from happy clients immediately after appointments.</li>
            <li><strong>Keyword Injection:</strong> Optimized their service menu with high-volume search terms like "Microblading Centurion" and "Lash Lifts."</li>
          </ul>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
          <h3 className="text-lg font-bold text-yellow-900 mb-2">The Results (90 Days)</h3>
          <ul className="list-disc pl-5 text-yellow-800 space-y-1">
            <li>Calls increased by <strong>310%</strong></li>
            <li>Profile views jumped from 50 to <strong>1,200 monthly</strong></li>
            <li>Consistent <strong>Top 3 "Map Pack" ranking</strong></li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: "2",
    category: "Case Study",
    title: "The Construction Blueprint: Building Trust Before the First Brick",
    excerpt: "Why traditional flyers failed for this construction firm, and how 'Trust Architecture' on their website landed a R2.5M contract.",
    date: "Nov 05, 2025",
    readTime: "7 min read",
    content: (
      <div className="space-y-6 text-gray-800">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">The Problem</h3>
          <p>In the construction industry, trust is everything. This client had a generic website that looked like a template. High-value clients were landing on the page and leaving instantly because it didn't scream 'Competence'.</p>
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">The Fix: Trust Architecture</h3>
          <p>We didn't just redesign the site; we engineered it for trust.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Project Showcases:</strong> Replaced stock photos with gritty, real on-site photography showing the process, not just the result.</li>
            <li><strong>Social Proof:</strong> Placed testimonials and industry accreditations above the fold.</li>
            <li><strong>Transparency:</strong> Added a 'Live Project Tracker' feature for clients.</li>
          </ul>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg border-l-4 border-gray-900">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Outcome</h3>
          <p>Within 4 weeks of launch, they secured a <strong>R2.5M residential development contract</strong>. The client specifically mentioned the "professionalism of the website" as a deciding factor.</p>
        </div>
      </div>
    )
  },
  {
    id: "3",
    category: "Strategy",
    title: "Why Traditional SEO is Dead (And What Replaced It)",
    excerpt: "Google is no longer a search engine; it is an answer engine. If your business is optimizing for keywords instead of entities, you are invisible.",
    date: "Dec 10, 2025",
    readTime: "4 min read",
    content: (
      <div className="space-y-6 text-gray-800">
        <p>Stop counting keywords. Google's AI updates (BERT and MUM) now understand <em>context</em>. They don't look for a page that says "Plumber" 50 times. They look for a page that <em>answers the questions</em> a person has when they need a plumber.</p>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">The New Rules:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>E-E-A-T:</strong> Experience, Expertise, Authoritativeness, and Trustworthiness.</li>
            <li><strong>Local Relevance:</strong> proving you are actually part of the community you serve.</li>
            <li><strong>Entity Optimization:</strong> Teaching Google <em>who</em> you are, not just <em>what</em> you do.</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: "4",
    category: "Strategy",
    title: "3 Hidden Settings in Google Business Profile",
    excerpt: "Most businesses fill out the basics and forget it. Here are the three settings that actually drive phone calls.",
    date: "Jan 02, 2026",
    readTime: "3 min read",
    content: (
      <div className="space-y-6 text-gray-800">
        <p>You have claimed your profile, but are you using it?</p>
        <ol className="list-decimal pl-5 space-y-3">
          <li><strong>Q&A Seeding:</strong> Don't wait for customers to ask. Ask your own common questions and answer them expertly. This helps voice search.</li>
          <li><strong>Services as Products:</strong> List your services in the "Products" tab. It gives them a visual card in search results that takes up more screen space.</li>
          <li><strong>Message Chat:</strong> Enable the chat feature. Customers want to text, not call. If you don't answer in 24 hours, Google turns it off. We automate this for you.</li>
        </ol>
      </div>
    )
  }
];

export const EarnedMedia = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* --- HEADER --- */}
      <div className="bg-gray-900 text-white pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          
          {/* --- BRANDING BLOCK --- */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
            {/* 1. New Logo Image */}
            <img 
              src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761701/Logo_mock1_jmjuoe.png" 
              alt="Happy Hunter Logo" 
              className="h-24 w-auto drop-shadow-2xl"
            />
            
            {/* 2. Text Branding (Yellow & Bold, Not White) */}
            <div className="flex flex-col items-center md:items-start">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-yellow-400 lowercase leading-none">
                happyhunterdigital
              </h1>
              <span className="text-xl md:text-2xl font-bold text-yellow-500/90 italic tracking-wider -mt-1">
                -Smart Marketing-
              </span>
            </div>
          </div>

          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-gray-200">
            Earned Media & Knowledge Base
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Real case studies, industry insights, and the strategies we use to dominate local search. No fluff, just results.
          </p>
        </div>
      </div>

      {/* --- ARTICLE GRID --- */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center gap-3 mb-10 border-b border-gray-100 pb-4">
          <BookOpen className="text-yellow-500" size={28} />
          <h2 className="text-3xl font-bold text-gray-900">Featured Insights</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {ARTICLES.map((article) => (
            <div 
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group bg-white rounded-2xl border border-gray-200 p-8 cursor-pointer hover:shadow-2xl hover:border-yellow-400 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-yellow-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              
              <div className="flex justify-between items-start mb-6">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                  ${article.category === 'Case Study' ? 'bg-gray-900 text-yellow-400' : 'bg-gray-100 text-gray-600'}
                `}>
                  {article.category}
                </span>
                <span className="text-gray-400 text-xs font-medium">{article.readTime}</span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-yellow-600 transition-colors leading-tight">
                {article.title}
              </h3>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                {article.excerpt}
              </p>

              <div className="flex items-center text-gray-900 font-bold group-hover:gap-3 transition-all">
                Read Full Case Study <ArrowRight size={20} className="ml-2 text-yellow-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- CTA BANNER --- */}
      <div className="bg-yellow-50 py-20 border-y border-yellow-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
            Want results like <span className="text-yellow-600">Profuse Beauty</span>?
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            We don't guess. We engineer outcome. Book a discovery call to see if your business qualifies for our growth partners program.
          </p>
          <a 
            href="https://calendly.com/happyhunterdigital/discovery" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-800 hover:scale-105 transition-all shadow-xl"
          >
            Book Strategy Call <Zap size={20} className="text-yellow-400" />
          </a>
        </div>
      </div>

      {/* --- ARTICLE MODAL --- */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedArticle(null)}
          ></div>
          
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-fade-in-up">
            <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-gray-100 px-8 py-4 flex justify-between items-center z-20">
               <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                 {selectedArticle.category}
               </span>
               <button 
                onClick={() => setSelectedArticle(null)}
                className="p-2 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
                {selectedArticle.title}
              </h2>
              
              <div className="flex items-center gap-6 text-sm text-gray-500 mb-10 pb-6 border-b border-gray-100">
                <span className="flex items-center gap-2"><Globe size={16}/> Happy Hunter Digital</span>
                <span>•</span>
                <span>{selectedArticle.date}</span>
              </div>

              <div className="prose prose-lg text-gray-700 max-w-none">
                {selectedArticle.content}
              </div>

              <div className="mt-16 bg-gray-50 p-8 rounded-xl border border-gray-100 text-center">
                <h4 className="text-xl font-bold text-gray-900 mb-2">Ready to be the next case study?</h4>
                <p className="text-gray-600 mb-6">Let's audit your current setup and find the gaps.</p>
                <a 
                   href="https://calendly.com/happyhunterdigital/discovery" 
                   target="_blank" 
                   rel="noreferrer"
                   className="inline-block bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-400/20"
                >
                  Start Your Audit
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
