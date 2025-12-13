import React, { useState } from 'react';
import { performAudit } from '../services/geminiService';
import { AuditResult, LoadingState } from '../types';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Search, MapPin, AlertCircle, CheckCircle, BarChart2, Loader2, ExternalLink, ArrowRight } from 'lucide-react';
import { CALENDLY_LINK } from '../constants';
// --- NEW IMPORTS FOR FIREBASE ---
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const AiAudit: React.FC = () => {
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !location.trim()) return;

    setStatus(LoadingState.LOADING);
    setResult(null);
    setErrorMsg('');

    // --- CAPTURE LEAD (FIREBASE) ---
    // This runs silently in the background. Even if the audit fails, you get the lead.
    try {
      await addDoc(collection(db, "leads"), {
        businessName: businessName,
        location: location,
        timestamp: serverTimestamp(), // Saves the exact time
        type: 'audit_request'
      });
      console.log("Lead captured successfully");
    } catch (err) {
      console.error("Error saving lead:", err);
      // We do not stop the audit if this fails, we just log the error.
    }

    // --- RUN AUDIT ---
    try {
      const data = await performAudit(businessName, location);
      setResult(data);
      setStatus(LoadingState.SUCCESS);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      setStatus(LoadingState.ERROR);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e'; // Green
    if (score >= 50) return '#FACC15'; // Yellow
    return '#ef4444'; // Red
  };

  return (
    <section className="py-20 bg-gray-900 border-y border-gray-800 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">AI Business Health Audit</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Analyze your visibility, trust, and conversion potential in real-time. 
            Powered by Google Gemini & Search Data.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 shadow-2xl mb-12">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 text-gray-500" size={20} />
              <input 
                type="text" 
                placeholder="Business Name" 
                className="w-full bg-gray-900 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow outline-none transition-all"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 text-gray-500" size={20} />
              <input 
                type="text" 
                placeholder="City/Area (e.g. Sandton, Pretoria)" 
                className="w-full bg-gray-900 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow outline-none transition-all"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={status === LoadingState.LOADING}
              className="bg-brand-yellow text-brand-dark font-bold py-3 px-6 rounded-lg hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === LoadingState.LOADING ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Analyzing...
                </>
              ) : (
                <>
                  <BarChart2 size={20} /> Run Audit
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error State */}
        {status === LoadingState.ERROR && (
           <div className="bg-red-500/10 border border-red-500 text-red-200 p-4 rounded-lg flex items-center gap-3">
             <AlertCircle size={24} />
             <p>{errorMsg}</p>
           </div>
        )}

        {/* Results State */}
        {status === LoadingState.SUCCESS && result && (
          <div className="animate-fade-in-up space-y-8">
            
            {/* Top Cards: Score & Win */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Score Gauge */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col items-center justify-center relative overflow-hidden">
                <h3 className="text-gray-400 font-medium mb-2 uppercase text-xs tracking-wider">System Health Score</h3>
                <div className="h-48 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      innerRadius="70%" 
                      outerRadius="100%" 
                      barSize={10} 
                      data={[{ name: 'Score', value: result.overallScore, fill: getScoreColor(result.overallScore) }]} 
                      startAngle={180} 
                      endAngle={0}
                    >
                      <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                      <RadialBar background dataKey="value" cornerRadius={30} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mt-4">
                    <span className="text-5xl font-extrabold text-white">{result.overallScore}</span>
                    <span className="text-gray-500 text-sm block">/100</span>
                  </div>
                </div>
              </div>

              {/* The "Win" Strategy */}
              <div className="md:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-brand-yellow/20 rounded-lg">
                    <CheckCircle className="text-brand-yellow" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Your Quick Win Strategy</h3>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed italic mb-6">
                  "{result.winStrategy}"
                </p>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 mb-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-1">Competitor Gap</h4>
                    <p className="text-gray-300 text-sm">{result.competitorGap}</p>
                </div>
                <a 
                  href={CALENDLY_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex self-start items-center gap-2 text-brand-yellow font-bold hover:underline"
                >
                  Implement this system now <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* Pillar Breakdown */}
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6">Detailed Pillar Analysis</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {result.pillars.map((pillar) => (
                  <div key={pillar.name} className="flex flex-col gap-2">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-sm font-medium text-gray-400">{pillar.name}</span>
                      <span className={`text-sm font-bold ${pillar.score >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                        {pillar.status}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-yellow transition-all duration-1000" 
                        style={{ width: `${pillar.score}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 leading-tight">
                      {pillar.observation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

             {/* Sources */}
             {result.sources.length > 0 && (
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Analysis Sources</h4>
                <div className="flex flex-wrap gap-2">
                  {result.sources.map((source, index) => (
                    <a 
                      key={index} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs text-blue-400 hover:text-blue-300 hover:border-blue-500 transition-colors"
                    >
                      {source.title.length > 30 ? source.title.substring(0, 30) + '...' : source.title}
                      <ExternalLink size={10} />
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </section>
  );
};
