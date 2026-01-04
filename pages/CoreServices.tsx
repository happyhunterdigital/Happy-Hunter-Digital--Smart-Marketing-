import React from 'react';
import { ShieldCheck, Megaphone, BrainCircuit, AlertTriangle, CheckCircle2, ArrowRight, Activity } from 'lucide-react';

export const CoreServices = () => {
  return (
    // Added 'relative z-10' to ensure it sits above any other layers
    <div className="min-h-screen bg-white font-sans text-gray-900 pt-28 relative z-10">
      
      {/* --- HERO SECTION --- */}
      <section className="bg-gray-900 text-white py-20 px-6 border-b border-gray-800">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 font-bold px-4 py-1.5 rounded-full text-sm uppercase tracking-wider">
            <Activity size={16} /> The 2026 Strategy
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
            Welcome to the Future of <br/>
            <span className="text-yellow-400">Business Visibility</span>
          </h1>
          
          <div className="max-w-3xl mx-auto space-y-4 text-lg md:text-xl text-gray-300 leading-relaxed">
            <p>
              In 2026, the biggest threat to your business isn't competition—it's <strong>invisibility</strong>.
            </p>
            <p>
              When customers ask their smart assistants to find services like yours, will your business be recommended? Or will you be filtered out before they ever know you exist?
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mt-8">
            <p className="font-medium text-yellow-400">
              Happy Hunter's Digital Entity Management & Optimization ensures you're not just found—you're trusted, verified, and recommended by the intelligent systems shaping customer decisions.
            </p>
          </div>
        </div>
      </section>

      {/* --- THE 3 PILLARS --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto bg-white">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-gray-900">The Smart Authority Ecosystem</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our done-for-you service transforms your business into a Verified, Recommended Authority built on three essential pillars:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Pillar 1: Trust Anchor */}
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-yellow-400 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-yellow-100 text-yellow-700 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Pillar 1: The Trust Anchor</h3>
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                <p className="text-xs font-bold text-red-800 uppercase mb-1">The Challenge</p>
                <p className="text-sm text-gray-700">Inconsistent information and poor review management make your business appear unreliable to intelligent systems.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <p className="text-xs font-bold text-green-800 uppercase mb-1">Our Solution</p>
                <p className="text-sm text-gray-700"><strong>Your Digital Passport.</strong> We optimize your profiles with real-time updates and precise local signals to prove your business is reliable.</p>
              </div>
            </div>
          </div>

          {/* Pillar 2: AI Megaphone */}
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-yellow-400 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <Megaphone size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Pillar 2: The AI Megaphone</h3>
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                <p className="text-xs font-bold text-red-800 uppercase mb-1">The Challenge</p>
                <p className="text-sm text-gray-700">Traditional marketing is obsolete. AI assistants only cite sources they recognize as authoritative entities.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <p className="text-xs font-bold text-green-800 uppercase mb-1">Our Solution</p>
                <p className="text-sm text-gray-700"><strong>Citable Content.</strong> We create content specifically for entities, ensuring intelligent systems choose YOU as the trusted answer.</p>
              </div>
            </div>
          </div>

          {/* Pillar 3: Conversion Brain */}
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-yellow-400 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <BrainCircuit size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Pillar 3: The Conversion Brain</h3>
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                <p className="text-xs font-bold text-red-800 uppercase mb-1">The Challenge</p>
                <p className="text-sm text-gray-700">Small businesses lose customers because they cannot handle inquiries and bookings 24/7.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <p className="text-xs font-bold text-green-800 uppercase mb-1">Our Solution</p>
                <p className="text-sm text-gray-700"><strong>Intelligent Automation.</strong> Our systems work 24/7—handling inquiries and qualifying leads so you only speak to buyers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAILURE POINTS TABLE --- */}
      <section className="bg-gray-900 text-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Why Businesses Fail in 2026</h2>
            <p className="text-gray-400">(And How We Prevent It)</p>
          </div>
          
          <div className="grid gap-4">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-2 gap-4 text-sm font-bold uppercase tracking-wider text-gray-500 mb-2 px-6">
              <div>The 2026 Failure Point</div>
              <div>The Happy Hunter Solution</div>
            </div>

            {/* Row 1: The Ghost Effect */}
            <div className="grid md:grid-cols-2 gap-6 p-8 bg-gray-800 rounded-2xl border border-gray-700 hover:bg-gray-750 transition-colors">
              <div>
                <div className="flex items-center gap-3 text-red-400 font-bold text-xl mb-3">
                  <AlertTriangle size={24} /> The "Ghost" Effect
                </div>
                <p className="text-gray-300 leading-relaxed">Your business exists, but intelligent search systems don't recognize it, so they never recommend you.</p>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-gray-700 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center">
                 <div className="flex items-center gap-2 text-yellow-400 font-bold text-lg mb-2">
                  <CheckCircle2 size={24} /> We make you the "Answer"
                </div>
                <p className="text-gray-300">We structure your digital presence so you're consistently recognized and recommended.</p>
              </div>
            </div>

            {/* Row 2: The Trust Deficit */}
            <div className="grid md:grid-cols-2 gap-6 p-8 bg-gray-800 rounded-2xl border border-gray-700 hover:bg-gray-750 transition-colors">
              <div>
                <div className="flex items-center gap-3 text-red-400 font-bold text-xl mb-3">
                  <AlertTriangle size={24} /> The Trust Deficit
                </div>
                <p className="text-gray-300 leading-relaxed">Inconsistent business information and weak reputation signals cause automated systems to filter you out.</p>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-gray-700 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center">
                 <div className="flex items-center gap-2 text-yellow-400 font-bold text-lg mb-2">
                  <CheckCircle2 size={24} /> We build your "Digital Passport"
                </div>
                <p className="text-gray-300">We ensure your profiles and local signals are flawless, so verification happens instantly.</p>
              </div>
            </div>

             {/* Row 3: The Silent Website */}
             <div className="grid md:grid-cols-2 gap-6 p-8 bg-gray-800 rounded-2xl border border-gray-700 hover:bg-gray-750 transition-colors">
              <div>
                <div className="flex items-center gap-3 text-red-400 font-bold text-xl mb-3">
                  <AlertTriangle size={24} /> The Silent Website
                </div>
                <p className="text-gray-300 leading-relaxed">Static websites that don't engage visitors or respond to inquiries lose customers to competitors.</p>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-gray-700 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center">
                 <div className="flex items-center gap-2 text-yellow-400 font-bold text-lg mb-2">
                  <CheckCircle2 size={24} /> We turn your site into an "Employee"
                </div>
                <p className="text-gray-300">We transform your site into an intelligent conversion hub that engages customers around the clock.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MOTTO & CTA --- */}
      <section className="bg-yellow-400 text-gray-900 py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-3xl md:text-5xl font-black mb-10 leading-tight">
            "In a world of noise, Happy Hunter makes sure you are the Signal."
          </p>
          <a 
            href="https://calendly.com/happyhunterdigital/discovery" 
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-xl font-bold text-xl hover:bg-gray-800 hover:scale-105 transition-all shadow-2xl"
          >
            Get Your Digital Passport Assessment <ArrowRight size={24} />
          </a>
        </div>
      </section>
    </div>
  );
};
