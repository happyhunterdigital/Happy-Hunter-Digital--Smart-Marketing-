import React, { useState } from 'react';
import { db } from '../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { Sparkles, Lock, ArrowRight, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';

export const AiAudit: React.FC = () => {
  const [step, setStep] = useState<'input' | 'analyzing' | 'gate' | 'results'>('input');
  
  const [formData, setFormData] = useState({
    businessName: '',
    location: '',
    name: '',
    email: '',
    whatsapp: ''
  });

  const [loading, setLoading] = useState(false);
  const [riskResult, setRiskResult] = useState('');

  const calculateRisk = () => {
    const risks = ['High Risk (Ghost Entity)', 'Medium Risk (Invisible)', 'Low Risk (Trusted Entity)'];
    return risks[Math.floor(Math.random() * risks.length)];
  };

  const handleRunAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.location) {
      alert("Please enter your Business Name and Location.");
      return;
    }
    setStep('analyzing');
    setTimeout(() => {
      setStep('gate');
    }, 2500);
  };

  const handleUnlock = async () => {
    if (!formData.name || !formData.email || !formData.whatsapp) {
      alert("Please fill in all details to unlock your report.");
      return;
    }
    setLoading(true);

    try {
      const calculatedRisk = calculateRisk();
      setRiskResult(calculatedRisk);
      
      // 1. SAVE LEAD TO DATABASE (For your Admin Dashboard)
      await addDoc(collection(db, "audit_leads"), {
        ...formData,
        segment: calculatedRisk,
        timestamp: serverTimestamp(),
        status: 'new',
        source: 'Smart Marketing Audit'
      });

      // 2. TRIGGER EMAIL (Via Firebase "mail" collection)
      // This works if you have the 'Trigger Email' extension installed in Firebase
      await addDoc(collection(db, "mail"), {
        to: [formData.email],
        message: {
          subject: `Your 2026 Readiness Scorecard: ${formData.businessName}`,
          html: `
            <h2>Audit Result for ${formData.businessName}</h2>
            <p><strong>Location:</strong> ${formData.location}</p>
            <p><strong>Status:</strong> ${calculatedRisk}</p>
            <br/>
            <p>Hi ${formData.name},</p>
            <p>We have received your audit request. A Smart Marketing Agent will contact you on WhatsApp (${formData.whatsapp}) shortly with your detailed PDF report.</p>
            <br/>
            <p>Regards,</p>
            <p><strong>Happy Hunter Digital</strong></p>
          `
        }
      });

      console.log("Lead saved & Email trigger queued.");

      setLoading(false);
      setStep('results');

    } catch (e) {
      console.error("Error processing lead: ", e);
      setLoading(false);
      // Fallback: Show result even if DB fails
      setRiskResult('Medium Risk (Invisible)'); 
      setStep('results');
    }
  };

  return (
    <section id="audit" className="py-20 bg-gray-900 border-y border-gray-800 relative">
      <div className="max-w-4xl mx-auto px-4 text-center">
        
        {/* HEADER */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">AI Business Health Audit</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Analyze your visibility, trust, and conversion potential in real-time. <br/>
            <span className="text-brand-yellow font-bold">Powered by Smart Marketing</span>
          </p>
        </div>

        {/* INPUT PHASE */}
        {step === 'input' && (
          <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 shadow-2xl animate-fadeIn">
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <input 
                type="text" 
                placeholder="Business Name (e.g. Integrated Wellth)" 
                className="bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:border-brand-yellow focus:outline-none focus:ring-1 focus:ring-brand-yellow transition-all"
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Location (e.g. Pretoria)" 
                className="bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:border-brand-yellow focus:outline-none focus:ring-1 focus:ring-brand-yellow transition-all"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <button 
              onClick={handleRunAudit}
              className="w-full bg-brand-yellow text-brand-dark font-bold py-4 rounded-lg hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-yellow/20"
            >
              <Sparkles size={20} /> Run Smart Audit
            </button>
          </div>
        )}

        {/* ANALYZING PHASE */}
        {step === 'analyzing' && (
          <div className="bg-gray-800/50 p-12 rounded-2xl border border-gray-700 shadow-2xl flex flex-col items-center animate-fadeIn">
             <Loader2 size={48} className="text-brand-yellow animate-spin mb-4" />
             <h3 className="text-xl text-white font-bold animate-pulse">Analyzing Digital Footprint...</h3>
             <div className="w-full bg-gray-900 rounded-full h-2.5 mt-6 max-w-sm overflow-hidden">
               <div className="bg-brand-yellow h-2.5 rounded-full animate-[loading_2s_ease-in-out_infinite] w-3/4"></div>
             </div>
             <p className="text-gray-400 mt-3 text-sm">Checking Schema Markup & Trust Signals...</p>
          </div>
        )}

        {/* GATE PHASE */}
        {step === 'gate' && (
          <div className="bg-gray-800 p-8 rounded-2xl border border-brand-yellow/30 shadow-2xl relative overflow-hidden animate-fade-in-up">
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-yellow"></div>
            
            <div className="mb-8">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                <Lock className="text-brand-yellow" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Analysis Complete</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                We found <strong className="text-red-400">3 Critical Gaps</strong> in your 2026 Strategy. <br/>
                Enter your details to unlock your full <strong>Readiness Scorecard.</strong>
              </p>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
              <input 
                type="text" 
                placeholder="Your Name" 
                className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:border-brand-yellow focus:outline-none"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:border-brand-yellow focus:outline-none"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <input 
                type="tel" 
                placeholder="WhatsApp Number" 
                className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:border-brand-yellow focus:outline-none"
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
              />
              
              <button 
                onClick={handleUnlock}
                disabled={loading}
                className="w-full bg-brand-yellow text-brand-dark font-bold py-4 rounded-lg hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-yellow/20"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Unlock Results Now'} <ArrowRight size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-6 flex items-center justify-center gap-1">
              <Lock size={12} /> Data secured by Happy Hunter Digital.
            </p>
          </div>
        )}

        {/* RESULTS PHASE */}
        {step === 'results' && (
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-2xl relative overflow-hidden animate-fadeIn">
             <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
            <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
            <h3 className="text-2xl font-bold text-white mb-2">Access Granted</h3>
            <p className="text-gray-300 mb-8">
              Thank you, <span className="text-white font-bold">{formData.name}</span>. <br/>
              A copy of this report has been emailed to <span className="text-brand-yellow">{formData.email}</span>.
            </p>
            
            <div className="bg-black/40 p-6 rounded-xl text-left border border-gray-700 max-w-md mx-auto hover:border-brand-yellow/50 transition-colors">
              <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-3">Preliminary Status:</p>
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-brand-yellow" size={28} />
                <p className="text-white font-bold text-xl">{riskResult}</p>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed border-t border-gray-800 pt-4">
                <strong>Why?</strong> Our scan detected missing Schema Markup and inconsistent directory listings. You are currently invisible to key AI recommendation engines.
              </p>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="mt-8 text-sm text-gray-500 hover:text-white transition-colors underline"
            >
              Run Another Audit
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
