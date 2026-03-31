// src/pages/Playbook/PlaybookChapter4.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const PlaybookChapter4 = () => {
  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-20 animate-fade-in font-sans">
      <div className="container mx-auto px-6 max-w-3xl">
        <Link to="/smart-news/playbook" className="inline-flex text-gray-500 hover:text-yellow-500 items-center gap-2 mb-10 uppercase text-[10px] font-black tracking-[0.2em] transition-colors">
          <ArrowLeft size={16}/> Back to Playbook Menu
        </Link>

        {/* SECTION 7 */}
        <div className="mb-16 border-b border-gray-800 pb-16">
          <div className="text-yellow-500 font-black uppercase tracking-widest text-sm mb-4">07</div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">Lead Magnets Evolved: Why Nobody Wants Your PDF</h2>
          <p className="text-xl text-gray-400 font-medium leading-relaxed mb-8">
            The static ebook is dead. In its place, AI-powered interactive tools that solve real problems — and convert at double or triple the rate.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed mb-10">
            The lead magnet arms race has been won by the brands offering something more valuable: <em>instant, personalised results</em>.
          </p>

          <div className="space-y-4 my-12">
            <div className="bg-black border border-gray-800 p-6 rounded-2xl flex items-start gap-6">
              <span className="text-4xl font-black text-yellow-500">1</span>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">User Completes Assessment</h4>
                <p className="text-gray-400 text-sm">The lead magnet collects rich intent data through the completion process — not just contact details.</p>
              </div>
            </div>
            <div className="bg-black border border-gray-800 p-6 rounded-2xl flex items-start gap-6">
              <span className="text-4xl font-black text-yellow-500">2</span>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">AI Scores & Segments Instantly</h4>
                <p className="text-gray-400 text-sm">Machine learning scores lead quality based on responses and behavioural signals.</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 8 */}
        <div className="mb-16 border-b border-gray-800 pb-16">
          <div className="text-yellow-500 font-black uppercase tracking-widest text-sm mb-4">08</div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">The Ethics of AI Marketing</h2>
          <p className="text-xl text-gray-400 font-medium leading-relaxed mb-8">
            As AI becomes the operating system of your marketing department, the ethical questions aren't abstract philosophy — they're brand strategy.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-3xl text-center">
              <span className="text-4xl block mb-4">🤝</span>
              <h4 className="text-lg font-bold text-white mb-2">Informed Consent</h4>
              <p className="text-gray-500 text-xs leading-relaxed">Customers should genuinely understand how their data powers the AI decisions affecting them.</p>
            </div>
            <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-3xl text-center">
              <span className="text-4xl block mb-4">🔍</span>
              <h4 className="text-lg font-bold text-white mb-2">Explainable AI</h4>
              <p className="text-gray-500 text-xs leading-relaxed">Transparency isn't a weakness — it's a differentiator.</p>
            </div>
            <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-3xl text-center">
              <span className="text-4xl block mb-4">🛡️</span>
              <h4 className="text-lg font-bold text-white mb-2">Data Minimisation</h4>
              <p className="text-gray-500 text-xs leading-relaxed">Collect only what you genuinely need. Smaller, cleaner datasets reduce risk.</p>
            </div>
          </div>
        </div>

        {/* SYNTHESIS & CTA */}
        <div className="mt-20 p-10 bg-gradient-to-br from-[#111827] to-black border border-yellow-500/20 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4">Ready to Build Your 2026 Marketing Machine?</h2>
          <p className="text-gray-400 mb-8 text-base max-w-lg mx-auto leading-relaxed">We help brands implement these strategies without the overwhelm. Let's talk about where you are and where you want to be.</p>
          <Link to="/audit" className="inline-block bg-yellow-500 text-black px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all text-sm">
            Let's Build Your Strategy →
          </Link>
        </div>

        <div className="flex justify-between items-center pt-8">
          <Link to="/smart-news/playbook/chapter-3" className="text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
            <ArrowLeft size={16}/> Previous
          </Link>
        </div>
      </div>
    </div>
  );
};
