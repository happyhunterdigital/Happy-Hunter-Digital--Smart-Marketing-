import React from 'react';
import { Calendar, MapPin, Clock, ArrowRight, CheckCircle2, ShieldCheck, Search, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SummitPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] animate-fade-in pt-20">
      
      {/* Hero Poster Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/dka0498ns/image/upload/v1766069617/Thabo_Leslie_Motsumi._AI_Google_my_Business_profile_optimization_Search_Everywhere_Optimation_SEO_Automation_and_Smart_digital_marketing._vncyse.png" 
            alt="Thabo Speaking" 
            className="w-full h-full object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-10">
          <div className="flex justify-center mb-6">
            <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765747667/Integrated_Wellth_Solutions_Logo_bodmyc1_iiervl.png" alt="Integrated Wellth" className="h-16 object-contain filter brightness-0 invert opacity-80" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6">
            The Digital <br/><span className="text-yellow-500">Bridge</span>
          </h1>
          <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
            Perfect financial books are useless if your business is invisible. Join us as we declassify the 2026 Agentic Marketing Architecture.
          </p>
        </div>
      </section>

      {/* The Strategic Role Section */}
      <section className="bg-[#0a0a0a] py-20 border-y border-gray-800">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">The Forensic Architect</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">At the Summit, Thabo Leslie Motsumi will act as your Chief Technology Officer for the day, executing three strategic mandates:</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-black border border-gray-800 rounded-3xl hover:border-yellow-500/50 transition-colors group">
              <Search className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={40}/>
              <h3 className="text-xl font-bold text-white mb-3">1. Diagnose (The Scan)</h3>
              <p className="text-gray-400 leading-relaxed text-sm">We will perform live, forensic audits on attendees' businesses, revealing your real-time "Invisibility Score" and proving exactly why Google Maps does not trust your entity.</p>
            </div>
            <div className="p-8 bg-black border border-gray-800 rounded-3xl hover:border-yellow-500/50 transition-colors group">
              <ShieldCheck className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={40}/>
              <h3 className="text-xl font-bold text-white mb-3">2. Prescribe (The Fix)</h3>
              <p className="text-gray-400 leading-relaxed text-sm">You will learn the "Mirror Rule"—the exact protocol to align your digital data (GMB) with physical reality so AI models like Gemini are forced to recommend you.</p>
            </div>
            <div className="p-8 bg-black border border-gray-800 rounded-3xl hover:border-yellow-500/50 transition-colors group">
              <Zap className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={40}/>
              <h3 className="text-xl font-bold text-white mb-3">3. Automate (The Future)</h3>
              <p className="text-gray-400 leading-relaxed text-sm">We will demonstrate how "Agentic Workflows" (AI employees) can autonomously handle your marketing while you focus on the financial strategies learned at the summit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Details & Value Transfer Grid */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          
          {/* Logistics */}
          <div className="space-y-8 p-8 bg-gray-900/30 rounded-3xl border border-gray-800">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-6 border-b border-gray-800 pb-4">Deployment Coordinates</h3>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
                <Calendar size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">Date</h4>
                <p className="text-gray-400">Saturday, 28 February 2026</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">Time</h4>
                <p className="text-gray-400">09:00 AM - 14:00 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">Location</h4>
                <p className="text-gray-400">Munyaka, Waterfall City</p>
                <p className="text-gray-500 text-sm">Johannesburg, South Africa</p>
              </div>
            </div>
            
            <div className="pt-6">
               <a href="https://www.quicket.co.za/events/352598-financial-clarity-for-non-financial-business-owners/" target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-black py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-colors">
                 Secure Summit Ticket <ArrowRight size={18} />
               </a>
            </div>
          </div>

          {/* Value Transfer */}
          <div className="bg-[#0a0a0a] border border-yellow-500/30 p-8 rounded-3xl shadow-[0_0_30px_rgba(234,179,8,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-xl">Value Transfer</div>
            <h3 className="text-2xl font-black text-white uppercase mb-2 mt-4">The R3,800 Audit</h3>
            <p className="text-gray-400 mb-6 text-sm">We are not just talking; we are deploying value.</p>
            
            <ul className="space-y-4 mb-8 relative z-10">
              <li className="flex items-start gap-3 text-gray-300 text-sm">
                <CheckCircle2 size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                <span><strong>Every attendee</strong> gains immediate access to the "Survival Scan" diagnostic tool.</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300 text-sm">
                <CheckCircle2 size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                <span><strong>Lucky winners</strong> will receive a full Manual Strategic Audit (Valued at R3,800) where Thabo personally aligns their digital architecture.</span>
              </li>
            </ul>

            <div className="pt-8 border-t border-gray-800">
               <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest font-bold text-center">Test The System Now</p>
               <Link to="/audit" className="w-full flex items-center justify-center gap-2 bg-gray-900 border border-gray-700 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:border-yellow-500 hover:text-yellow-500 transition-colors">
                 Initialize Live Scan <Search size={18} />
               </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
