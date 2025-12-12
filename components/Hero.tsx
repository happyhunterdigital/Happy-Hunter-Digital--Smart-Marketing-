import React from 'react';
import { ArrowRight, Activity } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-brand-dark pt-16 pb-20 lg:pt-32 lg:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text */}
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 bg-gray-800 rounded-full px-4 py-1.5 mb-8 border border-gray-700 justify-center lg:justify-start">
              <Activity size={16} className="text-brand-yellow" />
              <span className="text-xs font-semibold tracking-wide text-gray-300 uppercase">
                Stop Guessing, Start Scaling
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
              You Don't Need More Marketing. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-yellow-200">
                You Need a System.
              </span>
            </h1>
            
            <p className="mt-4 text-xl text-gray-300 mb-10 leading-relaxed font-light">
              We help South African SMEs build predictable growth engines using AI-driven automation and conversion engineering.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a 
                href="#audit"
                className="flex items-center justify-center gap-2 bg-brand-yellow text-brand-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-all shadow-xl shadow-yellow-500/20"
              >
                Audit My Business for Free
                <ArrowRight size={20} />
              </a>
              <a 
                href="#portfolio"
                className="flex items-center justify-center gap-2 bg-transparent border-2 border-gray-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:border-gray-500 hover:bg-gray-800 transition-all"
              >
                View Case Studies
              </a>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="relative mx-auto lg:mx-0 w-full max-w-md lg:max-w-full lg:pl-6">
            <div className="relative rounded-2xl overflow-hidden border border-gray-800 shadow-2xl shadow-brand-yellow/10 group">
               <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent z-10"></div>
               <img 
                 src="https://res.cloudinary.com/dka0498ns/image/upload/v1762926940/Gemini_Generated_Image_n574un574un574un_ylitql.png" 
                 alt="Thabo Leslie Motsumi - Founder of Happy Hunter"
                 className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
               />
               
               {/* Founder Name Overlay */}
               <div className="absolute bottom-0 right-0 z-20">
                 <div className="backdrop-blur-md bg-gray-900/85 py-4 px-6 rounded-tl-2xl border-t border-l border-gray-700/50 text-right">
                    <p className="text-white font-bold text-lg leading-none mb-1.5">Thabo Leslie Motsumi</p>
                    <p className="text-brand-yellow text-xs font-bold uppercase tracking-wider">Founder & Strategy Lead</p>
                 </div>
               </div>
            </div>
            
            {/* Decorative Elements around image */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-yellow/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
          </div>

        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-brand-yellow rounded-full mix-blend-multiply filter blur-[128px]"></div>
         <div className="absolute top-[40%] right-[20%] w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px]"></div>
      </div>
    </section>
  );
};