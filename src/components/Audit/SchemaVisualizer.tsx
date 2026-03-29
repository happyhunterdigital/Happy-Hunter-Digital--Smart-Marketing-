// src/components/Audit/SchemaVisualizer.tsx
import React from 'react';
import { Database, Network, XCircle, CheckCircle2 } from 'lucide-react';

interface SchemaVisualizerProps {
  schemas: string[];
}

export const SchemaVisualizer: React.FC<SchemaVisualizerProps> = ({ schemas }) => {
  const essentialSchemas = ['LocalBusiness', 'Organization', 'FAQPage', 'ProfessionalService'];
  const detected = schemas && schemas.length > 0 ? schemas : [];
  
  return (
    <div className="bg-black border border-gray-800 rounded-3xl p-8 mb-8 relative overflow-hidden group hover:border-yellow-500/30 transition-colors">
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
      <div className="flex items-center gap-3 mb-6 border-b border-gray-900 pb-4">
        <Network className="text-blue-500" size={24} />
        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Zero-Click Schema Topology</h3>
      </div>
      
      <p className="text-gray-400 text-sm mb-8 leading-relaxed">
        AI Agents rely on JSON-LD structured data to understand your entity. Below is your current machine-readable footprint.
      </p>

      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 justify-center mb-6">
        {/* Core Node */}
        <div className="bg-gray-900 border border-gray-700 p-4 rounded-2xl flex flex-col items-center z-10">
          <Database className="text-yellow-500 mb-2" size={24} />
          <span className="text-xs font-bold text-white uppercase tracking-widest">Digital Entity</span>
        </div>

        <div className="hidden md:block w-16 h-0.5 bg-gray-800"></div>
        <div className="md:hidden h-8 w-0.5 bg-gray-800"></div>

        {/* Schema Nodes */}
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          {essentialSchemas.map(schema => {
            const isDetected = detected.includes(schema) || detected.includes("Valid Schema (Unknown Type)");
            return (
              <div key={schema} className={`p-3 rounded-xl border flex items-center gap-2 ${isDetected ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                {isDetected ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                <span className="text-[10px] font-mono font-bold">{schema}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
