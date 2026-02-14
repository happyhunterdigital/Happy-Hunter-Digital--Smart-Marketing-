import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Globe } from 'lucide-react';

export default function TrustAnchor() {
  return (
    <div className="pt-40 pb-20 px-6 max-w-4xl mx-auto font-sans">
      <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-8 text-white">
        The Trust Anchor: Your Digital Passport [GMB Mastery]
      </h1>

      <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] mb-12">
        <p className="text-slate-300 leading-relaxed italic">
          <b>Direct Answer:</b> In 2026, your Google Business Profile (GBP) is your primary identity node. We call this the <b>Trust Anchor</b>. It provides the "Proof of Existence" that AI models like Gemini require before citing your brand in local search results.
        </p>
      </div>

      <div className="space-y-12 text-slate-400">
        <h2 className="text-3xl font-black text-white uppercase">The "Mirror Rule" Protocol</h2>
        <p>AI search engines detect hallucinations by comparing data points. If your GMB operating hours or services contradict your social media or directory citations, the AI flags you as <b>UNVERIFIED</b>. We use the Mirror Rule to ensure your digital entity is a perfect reflection of your physical business.</p>
        
        <ul className="space-y-4 bg-slate-900/20 p-8 rounded-3xl border border-slate-900">
          <li className="flex items-center gap-3 text-sm font-bold uppercase"><MapPin className="text-yellow-500" size={16}/> Standardize your NAP Data</li>
          <li className="flex items-center gap-3 text-sm font-bold uppercase"><Globe className="text-yellow-500" size={16}/> Bridge the Entity-Web Link</li>
          <li className="flex items-center gap-3 text-sm font-bold uppercase"><ShieldCheck className="text-yellow-500" size={16}/> Enforce Real-Time Verification</li>
        </ul>

        <Link to="/audit" className="w-full bg-yellow-500 text-slate-950 py-6 rounded-2xl font-black text-center block uppercase tracking-widest text-sm shadow-xl">Assess Your Trust Anchor Score</Link>
      </div>
    </div>
  );
}
