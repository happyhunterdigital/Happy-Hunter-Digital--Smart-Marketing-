import React from 'react';
import { PORTFOLIO } from '../constants';

export const Portfolio: React.FC = () => {
  return (
    <section className="py-24 bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">Proven Results</h2>
            <p className="text-gray-400">
              Real businesses, real growth. Here is how we engineered success for our partners.
            </p>
          </div>
          <a href="#" className="text-brand-yellow font-bold hover:text-white transition-colors">View All Projects &rarr;</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PORTFOLIO.map((item) => (
            <div key={item.id} className="bg-brand-dark rounded-xl overflow-hidden border border-gray-800 group hover:shadow-2xl hover:shadow-brand-yellow/10 transition-all">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={item.imageUrl} 
                  alt={item.client} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute top-4 left-4 bg-brand-yellow text-brand-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Case Study
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-1">{item.client}</h3>
                <p className="text-brand-yellow text-sm font-semibold mb-4">{item.outcome}</p>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};