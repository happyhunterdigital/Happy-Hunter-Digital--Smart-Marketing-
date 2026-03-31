// src/pages/Playbook/PlaybookChapter2.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const PlaybookChapter2 = () => {
  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-20 animate-fade-in font-sans">
      <div className="container mx-auto px-6 max-w-3xl">
        <Link to="/smart-news/playbook" className="inline-flex text-gray-500 hover:text-yellow-500 items-center gap-2 mb-10 uppercase text-[10px] font-black tracking-[0.2em] transition-colors">
          <ArrowLeft size={16}/> Back to Playbook Menu
        </Link>

        {/* SECTION 3 */}
        <div className="mb-16 border-b border-gray-800 pb-16">
          <div className="text-yellow-500 font-black uppercase tracking-widest text-sm mb-4">03</div>
          
          <div className="mb-10 rounded-[2rem] overflow-hidden border border-gray-800 shadow-2xl relative group">
            <img 
              src="https://res.cloudinary.com/dka0498ns/image/upload/v1774976804/happyhunterdigital_WhatsApp_Commerce_xsmfja.png" 
              alt="WhatsApp Commerce" 
              className="w-full h-64 md:h-80 object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none"></div>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">WhatsApp Commerce: The Highest-Leverage Channel</h2>
          <p className="text-xl text-gray-400 font-medium leading-relaxed mb-8">
            A 98% open rate and a complete sales funnel inside a single chat. This is where conversational commerce is happening right now.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            In 2026, the most sophisticated B2C brands do not just use WhatsApp for support. They use it to run their entire sales funnel. Discovery, consideration, purchase, and post-sale care all happen within a single chat window.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-3xl text-center shadow-xl">
              <span className="text-5xl font-black text-yellow-500 block mb-4">98%</span>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-widest leading-relaxed">WhatsApp message open rate</span>
            </div>
            <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-3xl text-center shadow-xl">
              <span className="text-5xl font-black text-yellow-500 block mb-4">2.8x</span>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-widest leading-relaxed">Higher cart recovery rate via WhatsApp</span>
            </div>
          </div>

          <h3 className="text-2xl font-black text-white mb-4">How the WhatsApp Sales Funnel Works</h3>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            The game-changer is WhatsApp Flows. These are native interactive components that let customers browse product catalogues, select options, fill forms, and complete purchases without ever leaving the app. This eliminates the primary cause of cart abandonment.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
              <span className="text-3xl block mb-4">🔍</span>
              <h4 className="text-lg font-bold text-white mb-2">Product Discovery</h4>
              <p className="text-gray-400 text-sm mb-4">AI-driven catalogues guide customers to exactly what they are looking for.</p>
              <div className="text-green-500 text-[10px] font-black uppercase tracking-widest">↑ 14x Revenue Increase</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
              <span className="text-3xl block mb-4">🛒</span>
              <h4 className="text-lg font-bold text-white mb-2">Cart Recovery</h4>
              <p className="text-gray-400 text-sm mb-4">Personalised recovery messages paired with native in-chat payment links.</p>
              <div className="text-green-500 text-[10px] font-black uppercase tracking-widest">↑ 2.8x Higher Recovery</div>
            </div>
          </div>
        </div>

        {/* SECTION 4 */}
        <div className="mb-16 border-b border-gray-800 pb-16">
          <div className="text-yellow-500 font-black uppercase tracking-widest text-sm mb-4">04</div>
          
          <div className="mb-10 rounded-[2rem] overflow-hidden border border-gray-800 shadow-2xl relative group">
            <img 
              src="https://res.cloudinary.com/dka0498ns/image/upload/v1774977095/happyhunterdigital_Professional_Content_E-E-A-T_xnphgl.png" 
              alt="Professional Content E-E-A-T" 
              className="w-full h-64 md:h-80 object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none"></div>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">The Content Wars: Why Human Insight is Premium</h2>
          <p className="text-xl text-gray-400 font-medium leading-relaxed mb-8">
            AI can produce content at scale. It cannot produce the lived experience, professional authority, and nuanced judgment that Google and your customers demand.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-[#111827] border border-gray-800 p-8 rounded-3xl">
              <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">The Losing Strategy</div>
              <h4 className="text-xl font-bold text-white mb-6">AI Content at Volume</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-start gap-2"><span className="text-gray-600 mt-0.5">→</span> Mass-produced, generic articles</li>
                <li className="flex items-start gap-2"><span className="text-gray-600 mt-0.5">→</span> Simulated expertise without lived experience</li>
                <li className="flex items-start gap-2"><span className="text-gray-600 mt-0.5">→</span> Content that looks human but feels robotic</li>
              </ul>
            </div>
            <div className="bg-black border border-gray-800 p-8 rounded-3xl">
              <div className="text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-4">The Winning Strategy</div>
              <h4 className="text-xl font-bold text-white mb-6">AI-Assisted, Human-Led</h4>
              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex items-start gap-2"><span className="text-yellow-500 mt-0.5">→</span> AI handles research, structure & SEO</li>
                <li className="flex items-start gap-2"><span className="text-yellow-500 mt-0.5">→</span> Humans own narrative voice & judgment</li>
                <li className="flex items-start gap-2"><span className="text-yellow-500 mt-0.5">→</span> Genuine practitioner insight for YMYL</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-8">
          <Link to="/smart-news/playbook/chapter-1" className="text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
            <ArrowLeft size={16}/> Previous
          </Link>
          <Link to="/smart-news/playbook/chapter-3" className="bg-yellow-500 text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all flex items-center gap-2">
            Next: Live Chat & Bookings <ArrowRight size={16}/>
          </Link>
        </div>
      </div>
    </div>
  );
};
