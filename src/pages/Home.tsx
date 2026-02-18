import { Search, ShieldCheck, Zap, Cpu, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContentRibbon } from '../components';

export default function Home() {
  return (
    <div className="font-sans text-white">
      <ContentRibbon />
      
      {/* Hero Section */}
      <section className="px-6 pt-32 pb-20 lg:pt-48 lg:pb-32 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="space-y-6 lg:space-y-8 animate-fade-in text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full mx-auto lg:mx-0">
            <Globe size={14} className="text-yellow-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              South African Entity Specialist
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
            Stop Being <br />
            <span className="text-yellow-500 italic">Invisible</span>
          </h1>
          
          <p className="text-slate-500 text-lg md:text-xl italic max-w-md mx-auto lg:mx-0 font-medium">
            Standard SEO is dead. If you aren't a <b>Verified Entity</b>, you don't exist in AI search.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
            <Link
              to="/audit"
              className="bg-yellow-500 text-slate-950 px-8 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-xl shadow-yellow-500/10"
            >
              Assess Your Business <Search size={22} />
            </Link>
            <Link
              to="/core-services"
              className="border-2 border-slate-800 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-slate-900 transition-all"
            >
              View Protocol
            </Link>
          </div>
        </div>
        
        <div className="relative group animate-fade-in [animation-delay:200ms]">
          <div className="relative rounded-[2rem] lg:rounded-[4rem] overflow-hidden border-2 border-slate-800 shadow-2xl">
            <img
              src="https://res.cloudinary.com/dka0498ns/image/upload/v1770566290/Thabo_Leslie_Motsumi_is_the_founder_and_key_figure_behind_happyhunterdigital_also_referred_to_as_Happy_Hunter_Smart_Marketing_yvomai.png"
              className="w-full grayscale brightness-90 hover:grayscale-0 transition-all duration-1000"
              alt="Thabo Leslie Motsumi - Founder"
              loading="eager"
            />
            <div className="absolute bottom-0 right-0 max-w-[90%] lg:max-w-[85%] bg-slate-950/90 backdrop-blur-xl border-t border-l border-yellow-500/30 p-4 lg:p-6 rounded-tl-[2rem] lg:rounded-tl-[3rem]">
              <p className="text-[10px] lg:text-[11px] text-slate-300 font-medium italic leading-relaxed">
                <span className="text-white font-black uppercase block mb-1 underline decoration-yellow-500/30">
                  Principal Strategist:
                </span>
                Thabo Leslie Motsumi architects digital entities that AI systems trust and recommend.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-slate-900/30 border-y border-slate-900 py-20 lg:py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-6 lg:space-y-8">
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
              The Great AI <span className="text-slate-800">Filter</span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed font-medium">
              Google SGE and Gemini are now filtering out businesses that lack{' '}
              <span className="text-yellow-500 font-black">Entity Trust</span>. 
              If your digital footprint is fragmented, AI search engines will protect their users by simply never mentioning your brand.
            </p>
          </div>
          
          <div className="grid gap-4">
            {[
              { title: "The Trust Anchor", desc: "Digital Passport (GMB) Management.", icon: ShieldCheck },
              { title: "The AI Megaphone", desc: "Answer Engine Optimization (AEO).", icon: Cpu },
              { title: "The Revenue Brain", desc: "Agentic Lead Automation.", icon: Zap }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="p-6 lg:p-8 border border-slate-800 rounded-[2rem] bg-slate-950/50 flex items-center gap-4 lg:gap-6 hover:border-yellow-500/30 transition-all"
              >
                <item.icon className="text-yellow-500 shrink-0" size={28} />
                <div>
                  <h4 className="font-black uppercase text-base lg:text-lg">{item.title}</h4>
                  <p className="text-slate-500 text-sm italic font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 lg:py-32 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter text-white">
            Trusted By <span className="text-yellow-500">Ambitious</span> SA Businesses
          </h3>
          
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
            {[
              "https://res.cloudinary.com/dka0498ns/image/upload/v1762929115/Black_Gold_Elegant_Floral_Gala_Night_Invitation_Square-1_xpngal.png",
              "https://res.cloudinary.com/dka0498ns/image/upload/v1765747667/Integrated_Wellth_Solutions_Logo_bodmyc1_iiervl.png",
              "https://res.cloudinary.com/dka0498ns/image/upload/v1770623694/IMG-20260209-WA0025_zgpgf7.jpg"
            ].map((src, i) => (
              <img 
                key={i} 
                src={src} 
                alt={`Client ${i + 1}`} 
                className="h-12 lg:h-16 w-auto object-contain"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
