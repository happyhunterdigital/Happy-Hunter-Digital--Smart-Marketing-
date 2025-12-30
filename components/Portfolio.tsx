import React from 'react';
import { ArrowUpRight, CheckCircle2, Lock, TrendingUp, Users, RefreshCw } from 'lucide-react';

export const Portfolio: React.FC = () => {
  // We define the data here to give them specific "2026" titles without breaking your other files
  const cases = [
    {
      id: 'custom-crafted',
      client: 'Custom Crafted Spaces',
      category: 'Trust & Compliance',
      title: 'The "Mirror Rule" Rescue',
      stat: '100% Visibility Restored',
      icon: <Lock className="text-brand-yellow" size={24} />,
      description: 'This manufacturer was hit with a "Deceptive Content" ban. We used our proprietary Mirror Rule Protocol to align their digital entity with physical signage, reversing the suspension in 72 hours.',
      // Using a placeholder manufacturing image - replace with your real screenshot if you have it
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'profuse-beauty',
      client: 'Profuse Beauty Cosmetics',
      category: 'Revenue Automation',
      title: 'The Revenue Brain',
      stat: '+40% Repeat Rate',
      icon: <RefreshCw className="text-purple-400" size={24} />,
      description: 'We fixed the "Leaky Bucket" by deploying an automated retention system. Instead of chasing new leads constantly, the system now automatically turns one-time buyers into loyal advocates.',
      // Beauty product placeholder
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'khongoloti',
      client: 'Khongoloti Training Academy',
      category: 'Authority Building',
      title: 'Entity Dominance',
      stat: 'Page 1 Rankings',
      icon: <TrendingUp className="text-blue-400" size={24} />,
      description: 'We stopped writing generic blogs and started publishing "Data-Rich" content. This Information Gain strategy forced Google to cite them as the primary educational authority in their niche.',
      // Education placeholder
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
    }
  ];

  return (
    <section id="portfolio" className="py-24 bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-brand-yellow font-bold tracking-wider uppercase text-xs mb-3 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-brand-yellow"></span>
              Strategic Interventions
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Trust Architecture <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-yellow-200">
                In Action
              </span>
            </h3>
            <p className="text-gray-400 leading-relaxed">
              We don't just "do projects." We engineer <strong>Digital Entities</strong> that survive the AI filter. Here is the proof.
            </p>
          </div>
          
          <a href="#contact" className="hidden md:flex items-center gap-2 text-white font-bold hover:text-brand-yellow transition-colors group">
            Start Your Project 
            <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
          </a>
        </div>

        {/* Grid Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((project) => (
            <div 
              key={project.id}
              className="group relative bg-brand-dark rounded-2xl border border-gray-800 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-yellow/10"
            >
              {/* Image Overlay */}
              <div className="h-56 overflow-hidden relative">
                <div className="absolute inset-0 bg-gray-900/40 group-hover:bg-gray-900/20 transition-colors z-10" />
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-20 bg-gray-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-700 shadow-lg flex items-center gap-2">
                  <div className="text-brand-yellow">
                    {project.icon}
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wide">{project.category}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-white mb-1 group-hover:text-brand-yellow transition-colors duration-300">
                    {project.title}
                  </h4>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Client: {project.client}
                  </p>
                </div>

                <p className="text-gray-400 leading-relaxed mb-6 text-sm border-l-2 border-gray-800 pl-4">
                  {project.description}
                </p>

                {/* Result Tag */}
                <div className="flex items-center gap-2 text-brand-yellow font-bold text-sm bg-brand-yellow/10 py-2 px-4 rounded-lg inline-flex">
                  <CheckCircle2 size={16} />
                  <span>Result: {project.stat}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile "View All" Link (Visible only on small screens) */}
        <div className="mt-12 text-center md:hidden">
          <a href="#contact" className="inline-flex items-center gap-2 text-brand-yellow font-bold hover:text-white transition-colors">
            Start Your Project <ArrowUpRight size={20} />
          </a>
        </div>

      </div>
    </section>
  );
};
