import React from 'react';
import { Shield, Globe, Code2, Fingerprint, AlertTriangle, CheckCircle, RotateCcw } from 'lucide-react';

interface AuditResultsProps {
  result: {
    success: boolean;
    score: number;
    summary: string;
    truths: string[];
    telemetry: {
      mapsStatus: string;
      website: string;
      schema: boolean;
      schemasDetected: string[];
      mapsName?: string;
      rating?: number;
      reviewCount?: number;
      kgmid?: string | null;
      kgmidName?: string | null;
    };
  };
  onReset: () => void;
}

export const AuditResults: React.FC<AuditResultsProps> = ({ result, onReset }) => {
  const isGood = result.score >= 70;
  const isGhost = result.telemetry.mapsStatus.includes('GHOST');
  const isHijacked = result.telemetry.mapsStatus.includes('HIJACKED');

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-black border border-gray-800 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className={`p-8 md:p-12 text-center relative overflow-hidden ${isGhost ? 'bg-gray-900' : isHijacked ? 'bg-red-950/30' : 'bg-gray-900/50'}`}>
          <div className={`absolute top-0 left-0 w-full h-1 ${isGood ? 'bg-green-500' : isGhost ? 'bg-gray-600' : 'bg-yellow-500'}`}></div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest mb-6">
            {isGood ? <CheckCircle size={14} className="text-green-500" /> : <AlertTriangle size={14} className="text-yellow-500" />}
            Audit Complete — {result.telemetry.mapsStatus}
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-white mb-2">{result.score}<span className="text-2xl text-gray-600">/100</span></h2>
          <p className={`text-lg font-mono ${isGood ? 'text-green-400' : 'text-yellow-400'}`}>
            {isGhost ? 'Business Not Found Online' : isHijacked ? 'Profile Needs Attention' : 'Business Verified — Good Start'}
          </p>
        </div>

        <div className="p-8 md:p-12 border-b border-gray-900">
          <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-4">What We Found</h3>
          <p className="text-gray-300 leading-relaxed text-lg">{result.summary}</p>
        </div>

        <div className="p-8 md:p-12 border-b border-gray-900">
          <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-6">Key Findings</h3>
          <div className="space-y-4">
            {result.truths.map((truth, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${i === 0 ? 'bg-yellow-500/20 text-yellow-500' : i === 1 ? 'bg-blue-500/20 text-blue-500' : 'bg-purple-500/20 text-purple-500'}`}>
                  {i + 1}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed pt-1">{truth}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-900/30 rounded-xl border border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <Shield size={18} className={isGhost ? 'text-gray-600' : 'text-green-500'} />
              <span className="text-xs font-mono text-gray-500 uppercase">Google Maps Listing</span>
            </div>
            <p className="text-white font-mono text-sm">{result.telemetry.mapsStatus}</p>
            {result.telemetry.mapsName && (
              <p className="text-gray-500 text-xs mt-1">Found: {result.telemetry.mapsName}</p>
            )}
            {result.telemetry.rating ? (
              <p className="text-gray-500 text-xs mt-1">Rating: {result.telemetry.rating} ({result.telemetry.reviewCount} reviews)</p>
            ) : null}
          </div>

          <div className="p-6 bg-gray-900/30 rounded-xl border border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <Globe size={18} className={result.telemetry.website !== 'None Linked' ? 'text-blue-500' : 'text-gray-600'} />
              <span className="text-xs font-mono text-gray-500 uppercase">Website</span>
            </div>
            <p className="text-white font-mono text-sm truncate">{result.telemetry.website}</p>
          </div>

          <div className="p-6 bg-gray-900/30 rounded-xl border border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <Fingerprint size={18} className={result.telemetry.kgmid ? 'text-yellow-500' : 'text-gray-600'} />
              <span className="text-xs font-mono text-gray-500 uppercase">Knowledge Graph ID (KGMID)</span>
            </div>
            {result.telemetry.kgmid ? (
              <>
                <p className="text-white font-mono text-sm break-all">/g/{result.telemetry.kgmid}</p>
                {result.telemetry.kgmidName && (
                  <p className="text-gray-500 text-xs mt-1">Trust anchor: {result.telemetry.kgmidName}</p>
                )}
              </>
            ) : (
              <p className="text-gray-500 font-mono text-sm">Not resolved</p>
            )}
          </div>

          <div className="p-6 bg-gray-900/30 rounded-xl border border-gray-800 md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <Code2 size={18} className={result.telemetry.schema ? 'text-purple-500' : 'text-gray-600'} />
              <span className="text-xs font-mono text-gray-500 uppercase">Website Code</span>
            </div>
            <p className="text-white font-mono text-sm mb-2">
              {result.telemetry.schema ? `Found ${result.telemetry.schemasDetected.length} pieces of structured data` : 'Needs structured data'}
            </p>
            {result.telemetry.schema && (
              <div className="flex flex-wrap gap-2">
                {result.telemetry.schemasDetected.map((s, i) => (
                  <span key={i} className="px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded text-xs font-mono text-purple-400">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-8 md:p-12 border-t border-gray-900 text-center">
          <button onClick={onReset} 
            className="inline-flex items-center gap-3 px-8 py-4 bg-yellow-500 rounded-xl font-black uppercase text-black hover:bg-white transition-all">
            <RotateCcw size={18} /> Run Another Check
          </button>
          <p className="text-gray-600 text-xs font-mono mt-4">Your report and your 2026 AI Marketing Playbook are on their way — check your inbox and WhatsApp.</p>
        </div>
      </div>
    </div>
  );
};
