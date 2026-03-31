// src/pages/Playbook/PlaybookChapter3.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const PlaybookChapter3 = () => {
  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-20 animate-fade-in font-sans">
      <div className="container mx-auto px-6 max-w-3xl">
        <Link to="/smart-news/playbook" className="inline-flex text-gray-500 hover:text-yellow-500 items-center gap-2 mb-10 uppercase text-[10px] font-black tracking-[0.2em] transition-colors">
          <ArrowLeft size={16}/> Back to Playbook Menu
        </Link>

        {/* SECTION 5 */}
        <div className="mb-16 border-b border-gray-800 pb-16">
          <div className="text-yellow-500 font-black uppercase tracking-widest text-sm mb-4">05</div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">AI Agents: From Answering Questions to Solving Problems</h2>
          <p className="text-xl text-gray-400 font-medium leading-relaxed mb-8">
            The 2026 service landscape is not about chatbots that respond. It is about agents that act. There is a significant difference, and it changes everything about your cost structure.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed mb-10">
            A chatbot answers questions. An agent solves problems. In 2026, the leading customer service operations have deployed agentic AI that can perform tasks across multiple business systems like checking inventory, processing refunds, and updating records without a human ever picking up the case.
          </p>

          <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 md:p-12 mb-12 shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-2">AI Agent Capability Impact</h3>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-10">Business impact by AI agent capability type</p>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-full md:w-64 text-xs font-bold text-gray-400 uppercase tracking-widest">Common Query Resolution</div>
                <div className="flex-1 h-8 bg-gray-900 rounded-full overflow-hidden relative"><div className="h-full bg-blue-500 flex items-center px-4 text-white font-black text-xs" style={{ width: '70%' }}>70% auto-resolved</div></div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-full md:w-64 text-xs font-bold text-gray-400 uppercase tracking-widest">Cost Optimisation vs Human</div>
                <div className="flex-1 h-8 bg-gray-900 rounded-full overflow-hidden relative"><div className="h-full bg-yellow-500 flex items-center px-4 text-black font-black text-xs" style={{ width: '90%' }}>90%+ reduction</div></div>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-black text-white mb-4">The "Human-in-the-Loop" Protocol</h3>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            The best organisations use AI for the routine and keep human agents specifically for "risk points" like crisis management, high-value negotiations, and sensitive situations. Total automation strips away the empathy required for premium service.
          </p>
        </div>

        {/* SECTION 6 */}
        <div className="mb-16 border-b border-gray-800 pb-16">
          <div className="text-yellow-500 font-black uppercase tracking-widest text-sm mb-4">06</div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">Direct Bookings: Stop Paying 25% Commission</h2>
          <p className="text-xl text-gray-400 font-medium leading-relaxed mb-8">
            For hospitality and service businesses, the OTA dependency trap is haemorrhaging margins. In 2026, the smart money is investing in direct booking infrastructure.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-3xl text-center shadow-xl">
              <span className="text-4xl font-black text-yellow-500 block mb-4">5.5%</span>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-widest leading-relaxed">Conversion rate for optimised direct engines</span>
            </div>
            <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-3xl text-center shadow-xl">
              <span className="text-4xl font-black text-yellow-500 block mb-4">70%</span>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-widest leading-relaxed">of all bookings now happen on mobile</span>
            </div>
            <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-3xl text-center shadow-xl">
              <span className="text-4xl font-black text-red-500 block mb-4">25%</span>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-widest leading-relaxed">Max OTA commission brands are reclaiming</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-8">
          <Link to="/smart-news/playbook/chapter-2" className="text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
            <ArrowLeft size={16}/> Previous
          </Link>
          <Link to="/smart-news/playbook/chapter-4" className="bg-yellow-500 text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all flex items-center gap-2">
            Next: Lead Magnets & Ethics <ArrowRight size={16}/>
          </Link>
        </div>
      </div>
    </div>
  );
};
