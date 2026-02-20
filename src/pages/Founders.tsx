import React from 'react';
import { Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Founders = () => (
  <div className="container mx-auto px-6 py-20 min-h-[80vh] flex items-center animate-fade-in">
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
      
      <div className="order-2 md:order-1 space-y-8">
        <div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-2">
            Thabo Leslie <span className="text-yellow-500">Motsumi</span>
          </h2>
          <p className="text-gray-500 uppercase tracking-widest font-bold text-sm">Founder & Lead Strategist</p>
        </div>

        <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
          <p>
            I started Happy Hunter Systems because I saw too many incredible South African businesses losing out to competitors simply because they didn't understand how the digital landscape was shifting.
          </p>
          <p>
            Marketing isn't about shouting the loudest anymore. With the rise of AI, it's about being the most <strong>trusted and verified</strong> source of information in your industry.
          </p>
          <p>
            My goal is to partner with ambitious SME owners to fix their digital foundations, automate their tedious tasks, and build systems that bring in customers predictably and reliably.
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <a href="https://www.linkedin.com/in/thabomotsumi" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-[#0a0a0a] border border-gray-800 rounded-xl hover:text-yellow-500 hover:border-yellow-500 transition-all font-medium">
            <Linkedin size={20} /> LinkedIn
          </a>
          <a href="mailto:hello@happyhunterdigital.com" className="flex items-center gap-2 px-6 py-3 bg-[#0a0a0a] border border-gray-800 rounded-xl hover:text-yellow-500 hover:border-yellow-500 transition-all font-medium">
            <Mail size={20} /> Email
          </a>
        </div>
      </div>

      <div className="order-1 md:order-2 relative flex justify-center">
        {/* Placeholder for Thabo's Photo */}
        <div className="w-full max-w-md aspect-[4/5] bg-gray-900 border border-gray-800 rounded-[2rem] overflow-hidden relative shadow-2xl z-10 flex items-center justify-center">
             <span className="text-gray-700 font-bold uppercase tracking-widest">[ Portrait Image ]</span>
        </div>
        {/* Background glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-yellow-500/10 blur-[100px] rounded-full z-0"></div>
      </div>

    </div>
  </div>
);
