import { ArrowRight, ShieldCheck, Zap, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-8 py-20">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
          STOP BEING <span className="text-yellow-500">INVISIBLE</span> <br />
          TO THE ALGORITHM.
        </h1>
        <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl leading-relaxed">
          We help South African businesses survive the <span className="text-white font-bold">Great AI Filter</span>. 
          Standard SEO is dead. It is time for <span className="text-yellow-500 font-bold">Digital Entity Management</span>.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link to="/audit" className="bg-yellow-500 text-slate-950 px-8 py-4 rounded-full font-black text-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2">
            START YOUR AUDIT <ArrowRight size={20}/>
          </Link>
          <Link to="/services" className="border border-slate-800 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-900 transition-colors">
            EXPLORE THE ECOSYSTEM
          </Link>
        </div>
      </div>

      {/* Pillars Section */}
      <div className="grid md:grid-cols-3 gap-8 py-20">
        <div className="p-8 border border-slate-900 rounded-3xl bg-slate-900/50 hover:border-yellow-500/50 transition-colors">
          <ShieldCheck className="text-yellow-500 mb-4" size={40} />
          <h3 className="text-2xl font-bold mb-2">The Trust Anchor</h3>
          <p className="text-slate-400">Compliance & Verification. We secure your Google Digital Passport to ensure legitimacy.</p>
        </div>
        <div className="p-8 border border-slate-900 rounded-3xl bg-slate-900/50 hover:border-yellow-500/50 transition-colors">
          <Cpu className="text-yellow-500 mb-4" size={40} />
          <h3 className="text-2xl font-bold mb-2">The AI Megaphone</h3>
          <p className="text-slate-400">Large Language Model Ops. We teach AI engines to cite YOU as the primary authority.</p>
        </div>
        <div className="p-8 border border-slate-900 rounded-3xl bg-slate-900/50 hover:border-yellow-500/50 transition-colors">
          <Zap className="text-yellow-500 mb-4" size={40} />
          <h3 className="text-2xl font-bold mb-2">The Revenue Brain</h3>
          <p className="text-slate-400">Agentic Automation. 24/7 AI systems that convert lookers into bookers while you sleep.</p>
        </div>
      </div>
    </div>
  );
}
