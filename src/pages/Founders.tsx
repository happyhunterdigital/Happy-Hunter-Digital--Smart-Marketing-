import { ShieldCheck, Zap, ArrowRight, MessageCircle, Award, Target, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Founders() {
  const values = [
    {
      title: "Strategic Intent",
      desc: "We don't chase vanity metrics. Every signal we create is designed to trigger a specific business outcome."
    },
    {
      title: "Entity Integrity", 
      desc: "Your digital presence must be a perfect mirror of your physical competence. We enforce that accuracy."
    },
    {
      title: "SA Market Expert",
      desc: "Tailoring global AI logic to the unique infrastructure and consumer behavior of South Africa."
    }
  ];

  return (
    <div className="pt-32 pb-20 px-6 font-sans text-white min-h-screen">
      {/* Visionary Header */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-24 lg:mb-32 animate-fade-in">
        <div className="space-y-8 lg:space-y-12">
          <div className="space-y-4">
            <span className="text-yellow-500 font-black uppercase tracking-[0.4em] text-[10px]">
              The Founder's Creed
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
              Thabo Leslie <br />
              <span className="text-yellow-500">Motsumi</span>
            </h1>
          </div>

          <div className="space-y-6 lg:space-y-8 text-lg lg:text-xl text-slate-400 italic font-medium leading-relaxed border-l-4 border-yellow-500/20 pl-6 lg:pl-8">
            <p>
              "Marketing is no longer about who shouts the loudest. It is about who the machine trusts enough to recommend."
            </p>
            <p className="text-base not-italic text-slate-500">
              As the architect of <span className="brand-name text-white text-lg lg:text-xl">happyhunterdigital</span>, 
              my mission is to protect South African SMEs from the 'Great AI Filter' and turn their digital footprints into verified authority nodes.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            <div className="p-4 lg:p-6 bg-slate-900/50 border border-slate-800 rounded-2xl lg:rounded-3xl">
              <Award className="text-yellow-500 mb-2" size={20} />
              <p className="text-white font-black text-xs lg:text-sm uppercase tracking-tight">Principal Strategist</p>
            </div>
            <div className="p-4 lg:p-6 bg-slate-900/50 border border-slate-800 rounded-2xl lg:rounded-3xl">
              <Target className="text-yellow-500 mb-2" size={20} />
              <p className="text-white font-black text-xs lg:text-sm uppercase tracking-tight">Entity Architect</p>
            </div>
          </div>
        </div>

        {/* Authority Image */}
        <div className="relative group">
          <div className="relative rounded-[2rem] lg:rounded-[4rem] overflow-hidden border-2 border-slate-800 shadow-2xl">
            <img
              src="https://res.cloudinary.com/dka0498ns/image/upload/v1770566290/Thabo_Leslie_Motsumi_is_the_founder_and_key_figure_behind_happyhunterdigital_also_referred_t_as_Happy_Hunter_Smart_Marketing_yvomai.png"
              className="w-full grayscale brightness-90 hover:grayscale-0 transition-all duration-1000"
              alt="Thabo Leslie Motsumi"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-40" />
          </div>
          <div className="absolute -top-6 -left-6 lg:-top-10 lg:-left-10 w-24 h-24 lg:w-40 lg:h-40 bg-yellow-500/5 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Philosophy Section */}
      <section className="bg-slate-900/30 border-y border-slate-800 py-20 lg:py-32 px-6">
        <div className="max-w-5xl mx-auto space-y-12 lg:space-y-20">
          <div className="text-center space-y-4 lg:space-y-6">
            <h3 className="text-3xl sm:text-4xl lg:text-6xl font-black uppercase tracking-tight leading-none">
              Why The <br />
              <span className="text-yellow-500 italic">Protocol</span> Exists
            </h3>
            <p className="max-w-2xl mx-auto text-slate-500 font-medium italic text-base lg:text-lg">
              The digital landscape of 2026 is hostile to 'unverified' entities. 
              Standard marketing creates noise; our protocol creates signals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {values.map((v, i) => (
              <div 
                key={i} 
                className="p-6 lg:p-10 border border-slate-800 rounded-[2rem] lg:rounded-[3rem] bg-slate-950/50 hover:border-yellow-500/20 transition-all text-center"
              >
                <h4 className="text-white font-black uppercase text-sm mb-3 lg:mb-4 tracking-widest">
                  {v.title}
                </h4>
                <p className="text-slate-500 text-xs lg:text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Handshake CTA */}
      <div className="py-20 lg:py-40 max-w-4xl mx-auto text-center space-y-8 lg:space-y-12 px-6">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-8xl font-black uppercase tracking-tighter leading-tight">
          Direct <span className="text-yellow-500">Access</span>
        </h2>
        <p className="text-slate-500 text-base lg:text-lg xl:text-xl italic font-medium">
          I don't hide behind account managers. My focus is your survival in the AI era.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 lg:gap-6">
          <a
            href="https://calendly.com/motsumitl/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-500 text-slate-950 px-8 lg:px-12 py-4 lg:py-5 rounded-2xl font-black text-base lg:text-lg hover:scale-110 transition-all flex items-center justify-center gap-3 shadow-2xl"
          >
            Book Strategy Call <ArrowRight size={20} />
          </a>
          <a
            href="https://wa.me/27601016673"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-8 lg:px-12 py-4 lg:py-5 rounded-2xl font-black text-base lg:text-lg hover:scale-110 transition-all flex items-center justify-center gap-3 shadow-2xl"
          >
            WhatsApp Thabo <MessageCircle size={20} fill="currentColor" />
          </a>
        </div>
      </div>
    </div>
  );
}
