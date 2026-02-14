import { Link } from 'react-router-dom';
import { Zap, Bot, MessageCircle } from 'lucide-react';

export default function RevenueBrain() {
  return (
    <div className="pt-40 pb-20 px-6 max-w-4xl mx-auto font-sans">
      <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-8 text-white">
        The Revenue Brain: Agentic Lead Automation [Guide]
      </h1>

      <div className="bg-slate-900 p-10 rounded-[3rem] border border-slate-800 mb-12 text-center">
        <p className="text-slate-300 text-xl font-medium italic">"In the AI era, intent has a half-life of 5 minutes. If you aren't automated, you are leaking revenue."</p>
      </div>

      <div className="space-y-12">
        <h2 className="text-3xl font-black text-white uppercase">From Secretary to Strategist</h2>
        <p className="text-slate-400 text-lg leading-relaxed">The <b>Revenue Brain</b> is a system of autonomous AI agents that qualify leads and book appointments 24/7. By delegating the initial 'Handshake' to an agent, you free the founder to focus on high-level closing and execution.</p>
        
        <div className="grid md:grid-cols-2 gap-6">
           <div className="p-8 border border-slate-800 rounded-3xl bg-slate-900/20 text-center">
              <Bot className="text-yellow-500 mx-auto mb-4" />
              <h4 className="text-white font-black uppercase text-xs mb-2">Triage System</h4>
              <p className="text-slate-600 text-xs">Filtering price-shoppers from A-Tier buyers.</p>
           </div>
           <div className="p-8 border border-slate-800 rounded-3xl bg-slate-900/20 text-center">
              <MessageCircle className="text-yellow-500 mx-auto mb-4" />
              <h4 className="text-white font-black uppercase text-xs mb-2">Instant Booking</h4>
              <p className="text-slate-600 text-xs">Directly syncing leads to your calendar.</p>
           </div>
        </div>
        
        <Link to="/audit" className="bg-yellow-500 text-slate-950 py-6 rounded-2xl font-black text-center block uppercase tracking-widest text-sm shadow-xl">Initialize Your Revenue Brain</Link>
      </div>
    </div>
  );
}
