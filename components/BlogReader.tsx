import React, { useEffect, useState } from 'react';
import { ArrowLeft, MessageCircle, Share2, Target, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { CALENDLY_LINK } from '../constants';
import { fetchBlogPostById } from '../services/contentService';
import { BlogPost } from '../types';

interface BlogReaderProps {
  blogId: string;
  onBack: () => void;
}

export const BlogReader: React.FC<BlogReaderProps> = ({ blogId, onBack }) => {
  const [post, setPost] = useState<BlogPost | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadPost = async () => {
      setLoading(true);
      try {
        const data = await fetchBlogPostById(blogId);
        setPost(data);
      } catch (error) {
        console.error("Failed to load blog post", error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [blogId]);

  // Inject Schema Markup for SEO and AI
  useEffect(() => {
    if (!post) return;

    const schemaId = 'json-ld-schema';
    
    // Remove existing schema if it exists to prevent duplicates
    const existingScript = document.getElementById(schemaId);
    if (existingScript) existingScript.remove();

    // BlogPosting Schema
    const blogSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.summary,
      "author": {
        "@type": "Person",
        "name": "Thabo Leslie Motsumi"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Happy Hunter - Smart Marketing Systems",
        "logo": {
          "@type": "ImageObject",
          "url": "https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg"
        }
      },
      "datePublished": "2025-12-01",
      "image": "https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      }
    };

    // FAQPage Schema for Q&A section
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": post.qa.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };

    const script = document.createElement('script');
    script.id = schemaId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify([blogSchema, faqSchema]);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(schemaId);
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [post]);

  if (loading) {
    return (
      <div className="bg-brand-dark min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-yellow" size={32} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-brand-dark min-h-screen flex flex-col items-center justify-center text-white">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <p className="text-xl font-bold mb-4">Post not found.</p>
        <button 
          onClick={onBack}
          className="text-brand-yellow hover:underline"
        >
          Return to Library
        </button>
      </div>
    );
  }

  // Identify the best Q&A pair for a featured snippet
  const featuredSnippet = post.qa && post.qa.length > 0 ? post.qa[0] : null;

  return (
    <article className="bg-brand-dark min-h-screen animate-fade-in pt-12 pb-24">
      {/* Container constrained to max-w-2xl (approx 672px) for optimal reading line length */}
      <div className="max-w-2xl mx-auto px-6 sm:px-8">
        
        {/* Navigation */}
        <button 
          onClick={onBack}
          className="group flex items-center text-gray-400 hover:text-brand-yellow transition-colors mb-12"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Earned Media Solutions
        </button>

        {/* Header */}
        <header className="mb-12 border-b border-gray-800 pb-10">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-yellow/10 text-brand-yellow text-xs font-bold uppercase tracking-wider mb-6">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-6">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-400 font-medium">
            <span>By Thabo Leslie Motsumi</span>
            <span className="text-gray-700">•</span>
            <span>5 min read</span>
            <span className="text-gray-700">•</span>
            <span>Happy Hunter Systems</span>
          </div>
        </header>

        {/* Featured Snippet / Quick Answer Section */}
        {featuredSnippet && (
          <div className="mb-12 bg-gray-800/80 border-l-4 border-brand-yellow rounded-r-xl p-6 shadow-lg animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3 text-brand-yellow font-bold uppercase text-xs tracking-wider">
              <Sparkles size={14} />
              <span>Quick Answer</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-3">
              {featuredSnippet.question}
            </h2>
            <p className="text-gray-200 leading-relaxed text-lg">
              {featuredSnippet.answer}
            </p>
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-invert prose-lg max-w-none 
            text-gray-200 
            prose-headings:text-white prose-headings:font-extrabold prose-headings:tracking-tight 
            prose-h2:mt-16 prose-h2:mb-6 prose-h2:text-3xl 
            prose-h3:mt-12 prose-h3:mb-4 prose-h3:text-2xl 
            prose-h4:mt-10 prose-h4:mb-3 prose-h4:text-xl 
            prose-p:text-gray-200 prose-p:leading-8 prose-p:mb-8 prose-p:text-lg 
            prose-a:text-brand-yellow prose-a:font-semibold prose-a:no-underline hover:prose-a:underline 
            prose-ul:my-8 prose-ul:list-disc prose-ul:pl-6 
            prose-li:text-gray-200 prose-li:mb-3 prose-li:leading-relaxed prose-li:marker:text-brand-yellow 
            prose-ol:my-8 prose-ol:list-decimal prose-ol:pl-6 
            prose-blockquote:border-l-4 prose-blockquote:border-brand-yellow prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:my-12 prose-blockquote:italic prose-blockquote:text-gray-300 prose-blockquote:bg-gray-900/50 prose-blockquote:rounded-r-lg
            prose-strong:text-white prose-strong:font-bold 
            prose-img:rounded-2xl prose-img:shadow-xl prose-img:border prose-img:border-gray-800 prose-img:my-10"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Q&A Section (Remaining Questions) */}
        {post.qa.length > 1 && (
          <div className="mt-20 bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <MessageCircle className="text-brand-yellow" /> More Common Questions
            </h3>
            <div className="space-y-8">
              {post.qa.slice(1).map((item, idx) => (
                <div key={idx} className="border-b border-gray-800 last:border-0 pb-8 last:pb-0">
                  <h4 className="text-white font-bold text-lg mb-3">{item.question}</h4>
                  <p className="text-gray-400 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-br from-brand-yellow to-yellow-600 rounded-2xl p-10 text-brand-dark text-center shadow-2xl shadow-yellow-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-3xl font-extrabold mb-4">Ready to Build Your System?</h3>
            <p className="mb-8 font-medium text-lg opacity-90 max-w-lg mx-auto">Implement this {post.category} strategy for your business today with our help.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href={CALENDLY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-dark text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-900 transition-colors inline-flex items-center justify-center gap-2 shadow-lg"
              >
                <Target size={20} /> Book A Free Discovery Call
              </a>
              <button onClick={onBack} className="bg-white/20 backdrop-blur-sm border-2 border-brand-dark text-brand-dark px-8 py-4 rounded-xl font-bold hover:bg-white/30 transition-colors">
                Explore More Solutions
              </button>
            </div>
          </div>
          
          {/* Decorative circles */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/5 rounded-full blur-3xl"></div>
        </div>

      </div>
    </article>
  );
};