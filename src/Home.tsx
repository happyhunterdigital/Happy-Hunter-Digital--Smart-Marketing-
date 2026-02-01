import { SEO } from '../components/SEO';
import { Shield, Cpu, Activity, ArrowRight } from 'lucide-react';

export const Home = () => {
  return (
    <div className="min-h-screen bg-brand-black text-white font-sans selection:bg-brand-gold selection:text-black">
      <SEO title="Digital Entity Management" description="Survival of the visible. We build trusted entities for the AI era." />
      
      <section className="h-screen flex flex-col justify-center px-8 max-w-6xl mx-auto">
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-800 bg-gray-900/50">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-mono">Entity Verified</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-8">
          Survive the <br />
          <span className="text-brand-gold italic">AI Filter.</span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
          Traditional SEO is failing. We build <strong>Trusted Digital Entities</strong> that AI models recognize and recommend. 
        </p>

        <div className="flex gap-4">
          <button className="bg-brand-gold text-brand-black px-8 py-4 rounded-md font-bold flex items-center gap-2 hover:bg-white transition-all">
            Get Your Readiness Score <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-12 px-8 pb-24 max-w-6xl mx-auto border-t border-gray-900 pt-24">
        <div>
          <Shield className="text-brand-gold mb-6" size={32} />
          <h3 className="text-xl font-bold mb-4 uppercase tracking-wider">The Trust Anchor</h3>
          <p className="text-gray-500 text-sm leading-relaxed">Entity verification and compliance management to ensure your business exists in the eyes of the algorithm.</p>
        </div>
        <div>
          <Cpu className="text-brand-gold mb-6" size={32} />
          <h3 className="text-xl font-bold mb-4 uppercase tracking-wider">AIO Optimization</h3>
          <p className="text-gray-500 text-sm leading-relaxed">Injection of high-authority data signals designed specifically for LLMs like Gemini and ChatGPT.</p>
        </div>
        <div>
          <Activity className="text-brand-gold mb-6" size={32} />
          <h3 className="text-xl font-bold mb-4 uppercase tracking-wider">Revenue Agents</h3>
          <p className="text-gray-500 text-sm leading-relaxed">Deploying 24/7 smart interfaces that bridge the gap between AI search and human transactions.</p>
        </div>
      </section>
    </div>
  );
};
