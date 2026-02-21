import React from 'react';
import { Search, ArrowRight, Database, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="animate-fade-in">
      <section className="relative container-fluid px-6 text-center py-32 md:py-48 overflow-hidden min-h-[90vh] flex flex-col justify-center">
        <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30 grayscale" style={{ backgroundImage: "url('https://res.cloudinary.com/dka0498ns/image/upload/v1770566290/Thabo_Leslie_Motsumi_is_the_founder_and_key_figure_behind_happyhunterdigital_also_referred_to_as_Happy_Hunter_Smart_Marketing_yvomai.png')" }}></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#020617]/80 via-[#020617]/90 to-[#050505]"></div>

        <div className="relative z-20 container mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-widest mb-8 backdrop-blur-md">
            <TrendingDown size={14} className="animate-pulse" />
            Alert: 87% of SMEs are invisible to AI Search
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black uppercase tracking-tighter leading-[0.9] mb-8 text-white drop-shadow-2xl">
            Your Business is a <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-yellow-600 italic text-white underline decoration-red-600 underline-offset-[15px]">Ghost to AI</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-300 text-lg md:text-xl font-medium mb-12 leading-relaxed drop-shadow-md">
            If you aren't a <strong className="text-white">Verified Entity</strong>, you don't exist. Our forensic engine exposes the digital gaps that are costing you monthly revenue.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/audit" className="bg-yellow-500 text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(234,179,8,0.3)]">
              <Search size={20} /> Initialize Smart Business Scan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
