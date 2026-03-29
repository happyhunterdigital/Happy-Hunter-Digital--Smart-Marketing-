// src/pages/Audit/AuditResults.tsx
import React from 'react';
import { AlertTriangle, Download, MessageSquare, ShieldCheck, TrendingDown, Calendar, Database } from 'lucide-react';
import { SchemaVisualizer } from '../../components/Audit/SchemaVisualizer';
import { AudioBriefing } from '../../components/Audit/AudioBriefing';

interface AuditResultsProps {
  verdict: any;
  reportRef: React.RefObject<HTMLDivElement>;
  downloadPDF: () => void;
  bizName: string;
}

export const AuditResults: React.FC<AuditResultsProps> = ({ verdict, reportRef, downloadPDF, bizName }) => {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      <AudioBriefing score={verdict.score} summary={verdict.summary} bizName={bizName} />

      <div ref={reportRef} className="p-8 md:p-12 bg-black border border-gray-800 rounded-[3rem] shadow-2xl relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10 border-b border-gray-800 pb-10">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-2">Your Digital Survival Score</p>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <span className={`text-7xl md:text-8xl font-black leading-none ${verdict.score >= 80 ? 'text-green-500' : verdict.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>{verdict.score}</span>
              <span className="text-gray-700 text-2xl font-bold">/100</span>
            </div>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-3xl flex items-center gap-4 w-full md:w-auto">
            <TrendingDown className="text-red-500" size={32} />
            <div>
              <p className="text-red-500 font-black text-2xl leading-none">{verdict.revenueLoss?.amount || 'R18,500+'}</p>
              <p className="text-red-500/70 text-[9px] uppercase font-bold mt-1 tracking-widest">Est. Monthly Revenue Recovery</p>
            </div>
          </div>
        </div>

        {/* HEADER: DIAGNOSIS */}
        <div className="mb-10 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <h3 className="text-red-500 font-black uppercase tracking-tight flex items-center gap-2 mb-2">
            <AlertTriangle size={18} /> CRITICAL VULNERABILITY
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            <b>Diagnosis:</b> {verdict.diagnosis || verdict.summary}
          </p>
        </div>

        <SchemaVisualizer schemas={verdict.telemetry?.schemasDetected || []} />

        <div className="space-y-10">
          {/* SECTION 1: IDENTITY CRISIS */}
          <div>
            <h3 className="text-white font-black uppercase text-xl md:text-2xl tracking-tight mb-4 flex items-center gap-3 border-b border-gray-800 pb-4">
              <ShieldCheck size={24} className={verdict.identityCrisis?.status === 'Aligned' ? 'text-green-500' : 'text-yellow-500'}/>
              Section 1: The Identity Crisis <span className="text-sm font-medium text-gray-500 ml-auto tracking-widest bg-gray-900 px-3 py-1 rounded-full">{verdict.identityCrisis?.status || 'Analyzing...'}</span>
            </h3>
            <div className="space-y-4">
              <p className="text-gray-300 text-sm"><b>The Truths:</b> {verdict.truths?.join(" | ") || "Pending detailed verification."}</p>
            </div>
          </div>

          {/* SECTION 2: THE GAP ANALYSIS */}
          {verdict.gapAnalysis && (
            <div>
              <h3 className="text-white font-black uppercase text-xl md:text-2xl tracking-tight mb-4 flex items-center gap-3 border-b border-gray-800 pb-4">
                <Database size={24} className="text-red-500"/>
                Section 2: The Gap Analysis
              </h3>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-6 border-l-2 border-red-500 pl-3">These are the "silent killers" of your local ranking.</p>
              
              <div className="grid gap-4">
                {verdict.gapAnalysis?.map((gap: any, i: number) => (
                  <div key={i} className="bg-black border border-gray-800 rounded-xl overflow-hidden relative">
                    <div className={`absolute top-0 left-0 w-1 h-full ${gap.status === 'HEALTHY' || gap.status === 'VERIFIED' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div className="p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-bold text-sm tracking-wide">• {gap.title}</h4>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${gap.status === 'HEALTHY' || gap.status === 'VERIFIED' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>[{gap.status}]</span>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed"><b>Urgency:</b> {gap.urgency}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 4: RECOVERY ROADMAP */}
        <div className="mt-12 p-8 md:p-10 bg-black border border-yellow-500/30 rounded-[2rem] text-center relative overflow-hidden group hover:shadow-neural-glow transition-all">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
          <p className="text-yellow-500 font-black uppercase tracking-widest text-xs mb-2">Section 4: The Recovery Roadmap</p>
          <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-4">Immediate Entity Alignment</h3>
          <p className="text-gray-400 mb-8 text-sm md:text-base max-w-xl mx-auto leading-relaxed border-t border-gray-800 pt-6 mt-6">
            <b>Recommendation:</b> Schedule a diagnostic mapping session to execute your proprietary recovery protocol.
          </p>
          <a href="https://calendly.com/motsumitl/30min" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-3 bg-yellow-500 text-black px-8 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_30px_rgba(234,179,8,0.2)] w-full md:w-auto">
            <Calendar size={18} /> Book Your 15-Minute Alignment Call
          </a>
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-4 italic">Secure your territory before your competitors lock you out of the Knowledge Graph.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <button onClick={downloadPDF} className="w-full p-5 bg-black border border-gray-800 text-white rounded-2xl font-bold uppercase text-xs hover:bg-gray-900 transition-all flex items-center justify-center gap-3">
          <Download size={18}/> Export Report to PDF
        </button>
        <a 
          href={`https://wa.me/27601016673?text=Hi%20Thabo!%20I%20just%20completed%20the%20Survival%20Scan%20for%20${bizName}%20and%20scored%20${verdict.score}/100.%20Let%27s%20talk%20about%20my%20Recovery%20Protocol.`}
          target="_blank" rel="noreferrer"
          className="w-full p-5 bg-black border border-gray-800 text-white rounded-2xl font-bold uppercase text-xs hover:text-yellow-500 hover:border-yellow-500 transition-all flex items-center justify-center gap-3"
        >
          <MessageSquare size={18}/> Message Thabo on WhatsApp
        </a>
      </div>
    </div>
  );
};
