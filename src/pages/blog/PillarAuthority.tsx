import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Cpu, Zap, Globe } from 'lucide-react';

export default function PillarAuthority() {
  return (
    <div className="pt-40 pb-20 px-6 max-w-4xl mx-auto font-sans">
      <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-8 text-white">
        The Architecture of Digital Authority [2026 Protocol]
      </h1>
      
      <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200" className="w-full h-96 object-cover rounded-[3rem] mb-12 border border-slate-800" alt="Digital Authority Architecture" />

      <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-8 mb-12 italic text-slate-300 leading-relaxed">
        <strong>Quick Answer:</strong> Modern digital authority is a three-tiered ecosystem integrating a <b>Trust Anchor</b> (GMB), an <b>AI Megaphone</b> (AEO), and a <b>Revenue Brain</b> (Automation). This architecture ensures South African SMEs bypass AI search filters and remain visible to high-intent buyers.
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-black uppercase text-white mb-6">Why traditional SEO is creating "Invisible SMEs"?</h2>
          <p className="text-slate-400 mb-6 leading-relaxed">Most SA businesses are fighting for keywords while the algorithm is looking for <b>Entities</b>. In 2026, being "good" isn't enough. If your business data is fragmented, you are being filtered out by Gemini and SearchGPT.</p>
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/blog/trust-anchor" className="p-6 border border-slate-900 rounded-3xl hover:border-yellow-500/30 transition-all bg-slate-900/20">
              <ShieldCheck className="text-yellow-500 mb-4" />
              <h4 className="font-bold text-sm uppercase">The Trust Anchor</h4>
            </Link>
            <Link to="/blog/ai-megaphone" className="p-6 border border-slate-900 rounded-3xl hover:border-yellow-500/30 transition-all bg-slate-900/20">
              <Cpu className="text-yellow-500 mb-4" />
              <h4 className="font-bold text-sm uppercase">The AI Megaphone</h4>
            </Link>
            <Link to="/blog/revenue-brain" className="p-6 border border-slate-900 rounded-3xl hover:border-yellow-500/30 transition-all bg-slate-900/20">
              <Zap className="text-yellow-500 mb-4" />
              <h4 className="font-bold text-sm uppercase">The Revenue Brain</h4>
            </Link>
          </div>
        </section>

        <div className="p-10 bg-yellow-500 rounded-[2.5rem] text-slate-950 text-center">
          <h3 className="text-3xl font-black uppercase mb-4 tracking-tighter">Secure Your Sovereignty</h3>
          <p className="font-bold mb-8">Join the IntegratedWellth Summit on 28 February at Waterfall City.</p>
          <Link to="/integrated-wellth-summit" className="bg-slate-950 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs inline-block">Reserve Spot</Link>
        </div>
      </div>
    </div>
  );
}
