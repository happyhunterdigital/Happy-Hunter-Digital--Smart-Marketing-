import React, { useEffect } from 'react';
import { PageMeta } from '../components/PageMeta';
import { Crosshair, ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen pb-20 animate-fade-in font-sans selection:bg-yellow-500 selection:text-black">
      <PageMeta
        title="404 — Signal Lost | Happy Hunter Digital"
        description="This page doesn't exist. Return to Happy Hunter Digital HQ — Smart Marketing for South African businesses."
        path="/404"
      />
      <header className="relative pt-40 pb-20 border-b border-gray-800 bg-[#0a0a0a]">
        <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            <Crosshair className="text-yellow-500" size={48} />
          </div>
          <p className="text-yellow-500 font-mono text-sm font-bold tracking-[0.3em] uppercase mb-4">Error 404 // Signal Lost</p>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 uppercase tracking-tighter text-white leading-none">
            Off <span className="text-yellow-500 italic">Target</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            The coordinates you entered don't resolve to any known target.
            This page has moved, been decommissioned, or never existed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-yellow-500 text-black font-black uppercase tracking-widest text-xs px-8 py-4 rounded-xl hover:bg-white transition-colors"
            >
              <Home size={16} /> Return to Base
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 border border-gray-800 text-gray-300 font-black uppercase tracking-widest text-xs px-8 py-4 rounded-xl hover:text-yellow-500 hover:border-yellow-500 transition-colors"
            >
              <ArrowLeft size={16} /> View Services
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};
