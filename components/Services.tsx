import React from 'react';
import { SERVICES } from '../constants';
import * as Icons from 'lucide-react';

export const Services: React.FC = () => {
  return (
    <section className="py-24 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Holistic Marketing Ecosystem</h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            We don't just "do ads." We build interconnected systems that attract, convert, and retain customers automatically.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => {
            const IconComponent = (Icons as any)[service.icon] || Icons.HelpCircle;
            
            return (
              <div 
                key={service.id} 
                className="group bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-brand-yellow/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-yellow/10 hover:bg-gray-800 cursor-pointer"
              >
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-yellow transition-colors duration-300">
                  <IconComponent className="text-brand-yellow group-hover:text-brand-dark transition-colors duration-300" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-yellow transition-colors">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};