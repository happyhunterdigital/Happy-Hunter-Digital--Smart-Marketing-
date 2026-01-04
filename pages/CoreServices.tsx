import React from 'react';
import { ShieldCheck, Megaphone, BrainCircuit, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export const CoreServices = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pt-24">
      
      {/* HERO SECTION */}
      <section className="bg-gray-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-block bg-yellow-400 text-gray-900 font-bold px-4 py-1 rounded-full text-sm uppercase tracking-wider mb-4">
            The 2026 Strategy
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Welcome to the Future of <span className="text-yellow-400">Business Visibility</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            In 2026, the biggest threat to your business isn't competition—it's invisibility. When customers ask AI assistants to find services like yours, will you be recommended?
          </p>
        </div>
      </section>

      {/* THE 3 PILLARS */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">The Smart Authority Ecosystem</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We transform your business into a Verified, Recommended Authority built on three essential pillars.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:border-yellow-400 transition-colors">
            <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Pillar 1: The Trust Anchor</h3>
            <p className="text-gray-600 text-sm mb-4">
              <strong>The Challenge:</strong> Outdated profiles make you appear unreliable to intelligent systems.
            </p>
            <p className="text-gray-800 text-sm leading-relaxed border-t border-gray-200 pt-4">
              <strong>Our Solution:</strong> Your Digital Passport. We optimize your profiles with real-time updates and local signals to prove you are active and trustworthy.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:border-yellow-400 transition-colors">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Megaphone size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Pillar 2: The AI Megaphone</h3>
            <p className="text-gray-600 text-sm mb-4">
              <strong>The Challenge:</strong> AI assistants only cite authoritative sources, ignoring standard websites.
            </p>
            <p className="text-gray-800 text-sm leading-relaxed border-t border-gray-200 pt-4">
              <strong>Our Solution:</strong> Citable Content. We create content engineered for entities, ensuring intelligent systems choose YOU as the trusted answer.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:border-yellow-400 transition-colors">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
              <BrainCircuit size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Pillar 3: The Conversion Brain</h3>
            <p className="text-gray-600 text-sm mb-4">
              <strong>The Challenge:</strong> Losing leads because you can't respond instantly 24/7.
            </p>
            <p className="text-gray-800 text-sm leading-relaxed border-t border-gray-200 pt-4">
              <strong>Our Solution:</strong> Intelligent Automation. Our systems handle inquiries and bookings 24/7, so you only speak to ready-to-buy customers.
            </p>
          </div>
        </div>
      </section>

      {/* FAILURE POINTS TABLE */}
      <section className="bg-gray-900 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Why Businesses Fail in 2026</h2>
          
          <div className="grid gap-6">
            {/* Row 1 */}
            <div className="grid md:grid-cols-2 gap-6 p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div>
                <div className="flex items-center gap-2 text-red-400 font-bold mb-2">
                  <AlertTriangle size={20} /> The "Ghost" Effect
                </div>
                <p className="text-gray-400 text-sm">Your business exists, but intelligent search systems don't recognize it, so they never recommend you.</p>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-gray-700 pt-4 md:pt-0 md:pl-6">
                 <div className="flex items-center gap-2 text-yellow-400 font-bold mb-2">
                  <CheckCircle2 size={20} /> The Happy Hunter Solution
                </div>
                <p className="text-gray-300 text-sm">We don't just rank you; we make you the <strong>answer</strong>.</p>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid md:grid-cols-2 gap-6 p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div>
                <div className="flex items-center gap-2 text-red-400 font-bold mb-2">
                  <AlertTriangle size={20} /> The Trust Deficit
                </div>
                <p className="text-gray-400 text-sm">Inconsistent info causes automated systems to filter you out as "unreliable."</p>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-gray-700 pt-4 md:pt-0 md:pl-6">
                 <div className="flex items-center gap-2 text-yellow-400 font-bold mb-2">
                  <CheckCircle2 size={20} /> The Digital Passport
                </div>
                <p className="text-gray-300 text-sm">We ensure your local signals are flawless, so verification happens instantly.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-2xl font-bold text-gray-200 italic mb-8">
              "In a world of noise, Happy Hunter makes sure you are the Signal."
            </p>
            <a 
              href="https://calendly.com/happyhunterdigital/discovery" 
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-all"
            >
              Get Your Digital Passport Assessment <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
