import React from 'react';
import { Calendar, MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

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

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765747667/Integrated_Wellth_Solutions_Logo_bodmyc1_iiervl.png" alt="Integrated Wellth" className="h-16 object-contain filter brightness-0 invert opacity-80" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6">
            The Protocol <br/><span className="text-yellow-500">Goes Live</span>
          </h1>
          <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
            We are honored to accept the invitation from Integrated Wellth Solutions. 
            Happy Hunter Systems will be declassifying our 2026 Agentic Marketing Architecture.
          </p>
        </div>
      </section>

      {/* Details Grid */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider">Date</h3>
                <p className="text-gray-400">Saturday, 28 February 2026</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider">Time</h3>
                <p className="text-gray-400">09:00 AM - 14:00 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider">Coordinates</h3>
                <p className="text-gray-400">Munyaka, Waterfall City</p>
                <p className="text-gray-500 text-sm">Johannesburg, South Africa</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-3xl">
            <h3 className="text-xl font-black text-white uppercase mb-6">Keynote: The Revenue Brain</h3>
            <ul className="space-y-4">
              {[
                "Why 'Traffic' is a vanity metric in 2026",
                "How to build an AI agent that sells for you",
                "Live demo of the 'Smart Marketing Scan'",
                "Networking with elite SA founders"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                  <CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-8 border-t border-gray-800">
               <p className="text-sm text-gray-500 mb-4">Limited seating available for this executive session.</p>
               <a href="https://www.quicket.co.za/events/352598-financial-clarity-for-non-financial-business-owners/" target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-yellow-500 transition-colors">
                 Reserve Seat <ArrowRight size={18} />
               </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
