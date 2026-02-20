import { Target, Zap, ShieldCheck, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="animate-fade-in">
      <section className="container mx-auto px-6 text-center py-20">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8">
          The AI Era <br/> <span className="text-brand-yellow italic text-transparent bg-clip-text bg-gradient-to-b from-brand-yellow to-yellow-700">Has Arrived</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-medium mb-12">
          Your business is either an <strong>Authority Entity</strong> or it is invisible. We provide the protocol to ensure you exist.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/audit" className="bg-brand-yellow text-brand-dark px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
            <Search size={20} /> Initiate Scan
          </Link>
        </div>
      </section>

      <section className="bg-black/30 py-24 border-y border-white/5">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <ShieldCheck className="text-brand-yellow" size={32}/>
            <h3 className="text-xl font-bold uppercase">The Trust Anchor</h3>
            <p className="text-gray-500 text-sm">Synchronization of your Google Business Profile to meet the 2026 Mirror Rule.</p>
          </div>
          <div className="space-y-4">
            <Zap className="text-brand-yellow" size={32}/>
            <h3 className="text-xl font-bold uppercase">The AI Megaphone</h3>
            <p className="text-gray-500 text-sm">Structuring data so Gemini and ChatGPT recommend you as the primary authority.</p>
          </div>
          <div className="space-y-4">
            <Target className="text-brand-yellow" size={32}/>
            <h3 className="text-xl font-bold uppercase">The Revenue Brain</h3>
            <p className="text-gray-500 text-sm">Automated lead injection and qualification systems that work 24/7.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
