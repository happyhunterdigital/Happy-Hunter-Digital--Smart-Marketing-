import React from 'react';
import { AiAudit } from './components/AiAudit';
import { Chatbot } from './components/Chatbot';
import { ShieldCheck, Target, Zap } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans selection:bg-brand-yellow selection:text-brand-dark">
      {/* Navigation */}
      <nav className="fixed w-full z-40 bg-brand-dark/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-black uppercase tracking-tighter">
            HappyHunter<span className="text-brand-yellow">Digital</span>
          </h1>
          <a href="#audit" className="bg-white/10 hover:bg-brand-yellow hover:text-brand-dark px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all">
            Start Audit
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-20 px-6 container mx-auto text-center">
        <div className="inline-block mb-6 px-4 py-1 rounded-full border border-brand-yellow/30 bg-brand-yellow/5 text-brand-yellow text-xs font-black uppercase tracking-[0.2em]">
          Entity Management Protocol
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-none mb-8">
          Stop Being <br/> <span className="text-transparent bg-clip-text bg-gradient-to-b from-brand-yellow to-yellow-700">Invisible</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-medium leading-relaxed mb-12">
          Standard SEO is dead. If you are not a <span className="text-white border-b-2 border-brand-yellow">Verified Entity</span>, you do not exist in the AI era.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <a href="#audit" className="bg-brand-yellow text-brand-dark px-8 py-4 rounded-lg font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2">
            <Target size={20} /> Assess Vulnerability
          </a>
          <a href="#services" className="border border-gray-700 text-white px-8 py-4 rounded-lg font-black uppercase tracking-widest hover:bg-gray-800 transition-colors">
            View Protocol
          </a>
        </div>
      </header>

      {/* Audit Tool Lead Magnet */}
      <div id="audit">
        <AiAudit />
      </div>

      {/* Features Grid */}
      <section id="services" className="py-24 bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 border border-gray-800 bg-brand-dark/50 rounded-2xl hover:border-brand-yellow/50 transition-colors group">
              <ShieldCheck className="text-brand-yellow mb-6 group-hover:scale-110 transition-transform" size={40} />
              <h3 className="text-xl font-bold uppercase mb-4">Trust Anchor</h3>
              <p className="text-gray-400 leading-relaxed">
                We fix your "Digital Passport" (GMB). The Mirror Rule ensures your data matches exactly across all nodes, verifying your existence to Google.
              </p>
            </div>
            <div className="p-8 border border-gray-800 bg-brand-dark/50 rounded-2xl hover:border-brand-yellow/50 transition-colors group">
              <Zap className="text-brand-yellow mb-6 group-hover:scale-110 transition-transform" size={40} />
              <h3 className="text-xl font-bold uppercase mb-4">AI Megaphone</h3>
              <p className="text-gray-400 leading-relaxed">
                We structure your data so ChatGPT, Gemini, and Claude recommend YOU as the primary answer, not just a link on Page 2.
              </p>
            </div>
            <div className="p-8 border border-gray-800 bg-brand-dark/50 rounded-2xl hover:border-brand-yellow/50 transition-colors group">
              <Target className="text-brand-yellow mb-6 group-hover:scale-110 transition-transform" size={40} />
              <h3 className="text-xl font-bold uppercase mb-4">Revenue Brain</h3>
              <p className="text-gray-400 leading-relaxed">
                Automated lead capture systems that work while you sleep. Turn traffic into booked appointments without lifting a finger.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-900 text-center">
        <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">
          &copy; 2025 Happy Hunter Digital. All Rights Reserved.
        </p>
      </footer>

      {/* Global Chatbot */}
      <Chatbot />
    </div>
  );
}

export default App;
