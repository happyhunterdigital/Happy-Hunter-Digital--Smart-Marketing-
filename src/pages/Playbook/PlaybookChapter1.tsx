// src/pages/Playbook/PlaybookChapter1.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const PlaybookChapter1 = () => {
  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-20 animate-fade-in font-sans">
      <div className="container mx-auto px-6 max-w-3xl">
        <Link to="/smart-news/playbook" className="inline-flex text-gray-500 hover:text-yellow-500 items-center gap-2 mb-10 uppercase text-[10px] font-black tracking-[0.2em] transition-colors">
          <ArrowLeft size={16}/> Back to Playbook Menu
        </Link>

        {/* SECTION 1 */}
        <div className="mb-16 border-b border-gray-800 pb-16">
          <div className="text-yellow-500 font-black uppercase tracking-widest text-sm mb-4">01</div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">AI Personalization: The End of "One Size Fits All"</h2>
          <p className="text-xl text-gray-400 font-medium leading-relaxed mb-8">
            Mass marketing is over. In 2026, your customers don't just prefer personalised experiences — they expect them as the baseline.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed mb-10">
            Think about the last time you felt like a brand truly <em>got</em> you. That feeling didn't happen by accident — it was engineered by AI. And in 2026, that engineering has become so sophisticated that the gap between "brands doing this" and "brands not doing this" has become a canyon.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-3xl text-center shadow-xl">
              <span className="text-5xl font-black text-yellow-500 block mb-4">75%</span>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-widest leading-relaxed">of consumers are more likely to buy from brands that personalise content</span>
            </div>
            <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-3xl text-center shadow-xl">
              <span className="text-5xl font-black text-yellow-500 block mb-4">48%</span>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-widest leading-relaxed">of organisations prioritising hyper-personalisation exceed revenue targets</span>
            </div>
            <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-3xl text-center shadow-xl">
              <span className="text-4xl font-black text-yellow-500 block mb-4 mt-2">Real-time</span>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-widest leading-relaxed">is the new standard — static segments are obsolete</span>
            </div>
          </div>

          <h3 className="text-2xl font-black text-white mb-4">From Audience Segments to Individual Conversations</h3>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            The old way was to put people in buckets: "Women, 25–34, interested in fitness." The new way? Your AI system knows that <em>this specific person</em> browsed hiking boots three times this week, added a water bottle to their cart and abandoned it, and opens emails at 7am on weekdays. It responds to all of that — automatically, in real time.
          </p>
          
          <div className="overflow-x-auto bg-[#0a0a0a] rounded-3xl border border-gray-800 shadow-2xl mb-12">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900 border-b border-gray-800 text-yellow-500">
                  <th className="p-6 font-bold uppercase tracking-widest text-xs">Dimension</th>
                  <th className="p-6 font-bold uppercase tracking-widest text-xs">2024 Legacy State</th>
                  <th className="p-6 font-bold uppercase tracking-widest text-xs">2026 Agentic State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-sm text-gray-300">
                <tr className="hover:bg-gray-900/30 transition-colors">
                  <td className="p-6 font-bold text-white">Primary Data Driver</td><td className="p-6">Third-party cookies & broad cohorts</td><td className="p-6 text-yellow-500">First-party & zero-party data you own</td>
                </tr>
                <tr className="hover:bg-gray-900/30 transition-colors">
                  <td className="p-6 font-bold text-white">Execution Speed</td><td className="p-6">Scheduled batch processing</td><td className="p-6 text-yellow-500">Instantaneous, real-time adaptation</td>
                </tr>
                <tr className="hover:bg-gray-900/30 transition-colors">
                  <td className="p-6 font-bold text-white">Content Logic</td><td className="p-6">Pre-defined rule-based templates</td><td className="p-6 text-yellow-500">Generative, context-aware assembly</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-2xl font-black text-white mb-4">The Privacy Paradox You Can't Ignore</h3>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            Here's the uncomfortable tension sitting at the heart of all this: consumers want personalisation that feels like magic, but they're deeply suspicious of the data collection required to make it happen.
          </p>

          <div className="p-8 bg-green-500/10 border-l-4 border-green-500 rounded-r-3xl">
            <h4 className="text-green-500 font-black uppercase tracking-widest text-xs mb-2">The Happy Hunter Take</h4>
            <p className="text-white text-base font-medium">
              The brands winning this paradox aren't fighting it — they're solving it head-on with "Privacy-by-Design." That means building data minimisation and anonymisation into your AI architecture from day one, and being transparent about what you collect and why. Trust isn't a soft metric. In 2026, it's your most bankable asset.
            </p>
          </div>
        </div>

        {/* SECTION 2 */}
        <div className="mb-16 border-b border-gray-800 pb-16">
          <div className="text-yellow-500 font-black uppercase tracking-widest text-sm mb-4">02</div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">Email Marketing's Unexpected Comeback Story</h2>
          <p className="text-xl text-gray-400 font-medium leading-relaxed mb-8">
            Everyone predicted email was dying. In 2026, it's the highest-ROI channel in the toolkit — but only if you've moved beyond the static broadcast.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            With third-party cookies gone, the scramble for owned data channels has been fierce. And the channel that emerged on top? Email. Not the batch-blast, one-size-fits-all email of 2018 — but a sophisticated, interactive, AI-optimised email that functions as a full e-commerce experience inside the inbox.
          </p>

          <div className="my-10 p-8 bg-yellow-500/10 border-l-4 border-yellow-500 rounded-r-3xl">
            <p className="text-white text-lg font-medium italic">
              "Email is no longer a broadcast tower. In 2026, it's a two-way conversation, a storefront, and a loyalty engine — all inside a single send."
            </p>
          </div>

          <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 md:p-12 mb-12 shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-2">Email Performance: Standard vs Interactive</h3>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-10">Industry averages vs impact of interactive elements</p>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-full md:w-64 text-xs font-bold text-gray-400 uppercase tracking-widest">B2C Conv Rate (Standard)</div>
                <div className="flex-1 h-8 bg-gray-900 rounded-full overflow-hidden relative"><div className="h-full bg-yellow-500/50 flex items-center px-4 text-white font-black text-xs" style={{ width: '28%' }}>2.8%</div></div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-full md:w-64 text-xs font-bold text-gray-400 uppercase tracking-widest">B2C Conv Rate (Interactive)</div>
                <div className="flex-1 h-8 bg-gray-900 rounded-full overflow-hidden relative"><div className="h-full bg-green-500 flex items-center px-4 text-black font-black text-xs" style={{ width: '35%' }}>3.5%</div></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-8">
          <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">End of Chapter 1</span>
          <Link to="/smart-news/playbook/chapter-2" className="bg-yellow-500 text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all flex items-center gap-2">
            Next: WhatsApp & Content <ArrowRight size={16}/>
          </Link>
        </div>
      </div>
    </div>
  );
};
