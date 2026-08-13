// src/components/HeroSection.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Play } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      time += 0.003;
      const w = canvas.width;
      const h = canvas.height;

      const gradient = ctx.createRadialGradient(
        w * (0.3 + Math.sin(time) * 0.2 + mousePos.x * 0.3),
        h * (0.4 + Math.cos(time * 0.7) * 0.2 + mousePos.y * 0.3),
        0,
        w * 0.5,
        h * 0.5,
        w * 0.8
      );

      gradient.addColorStop(0, 'rgba(234, 179, 8, 0.15)');
      gradient.addColorStop(0.3, 'rgba(251, 146, 60, 0.08)');
      gradient.addColorStop(0.6, 'rgba(239, 68, 68, 0.04)');
      gradient.addColorStop(1, 'rgba(10, 10, 15, 0)');

      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      const gradient2 = ctx.createRadialGradient(
        w * (0.7 + Math.cos(time * 0.8) * 0.15),
        h * (0.6 + Math.sin(time * 0.5) * 0.15),
        0,
        w * 0.5,
        h * 0.5,
        w * 0.6
      );

      gradient2.addColorStop(0, 'rgba(251, 191, 36, 0.06)');
      gradient2.addColorStop(1, 'rgba(10, 10, 15, 0)');
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, w, h);

      animationId = requestAnimationFrame(draw);
    };
    draw();
    setTimeout(() => setIsLoaded(true), 100);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight
    });
  };

  return (
    <section 
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden" 
      onMouseMove={handleMouseMove}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" style={{ filter: 'blur(60px)' }} />
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className={`relative z-10 container mx-auto px-6 text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-8 hover:bg-white/10 transition-all cursor-default group">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-medium text-gray-300 tracking-wide">Thabo typically replies in 8 min</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8 text-white">
          Can Customers Find Your Business on <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-400">
              Google, ChatGPT, and WhatsApp?
            </span>
            <svg className="absolute -bottom-2 left-0 w-full h-4" viewBox="0 0 300 12" preserveAspectRatio="none">
              <path d="M0,6 Q75,0 150,6 T300,6" stroke="url(#amber-gradient)" strokeWidth="3" fill="none" strokeLinecap="round" className="animate-draw" />
              <defs>
                <linearGradient id="amber-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed mb-12 font-light">
          We help South African businesses show up everywhere their customers are searching — Google search, AI chatbots like ChatGPT and Gemini, Google Maps, and WhatsApp. Based in Pretoria, serving SMEs across Johannesburg and South Africa.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/audit" className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black uppercase tracking-widest text-sm rounded-2xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(251,191,36,0.3)]">
            <span className="relative z-10 flex items-center gap-2">
              <Search size={18} />
              Free Online Health Check
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>

          <button className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 transition-all">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play size={16} className="text-amber-400 ml-0.5" fill="currentColor" />
            </div>
            <span className="text-sm font-semibold">Watch 90-sec Explainer</span>
          </button>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-gray-500">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-[#0a0a0f]" role="img" aria-label={`Client ${i}`} />
              ))}
            </div>
            <span className="text-xs">500+ Businesses Verified</span>
          </div>
          <div className="h-4 w-px bg-gray-800" aria-hidden="true" />
          <span className="text-xs">Pretoria, South Africa</span>
          <div className="h-4 w-px bg-gray-800" aria-hidden="true" />
          <span className="text-xs">POPIA & GDPR Compliant</span>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 animate-bounce">
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gray-600 to-transparent" />
      </div>
    </section>
  );
};
