// src/pages/CoreServices/CoreServicesForm.tsx
import React, { useState } from 'react';
import { Zap, ShieldCheck, ChevronDown } from 'lucide-react';
import { db, functions } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { Telemetry } from '../../posthog';
import { SERVICES_DATA } from './CoreServices';

export const CoreServicesForm: React.FC = () => {
  const [form, setForm] = useState({ name: '', website: '', service: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    Telemetry.serviceRequested(form.service, form.website);
    try {
      const submitServiceRequest = httpsCallable(functions, 'submitServiceRequest');
      await submitServiceRequest({ ...form });
      setSubmitted(true);
    } catch (error) {
      console.error("Submission Error:", error);
      await addDoc(collection(db, "leads"), {
        ...form,
        source: "Fallback Client-Side Capture",
        timestamp: serverTimestamp()
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-6 bg-black text-white border-t-8 border-yellow-500">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">
            You do not need another agency.<br/>
            <span className="text-yellow-500">You need an Entity Manager.</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            At Happy Hunter Digital, we have perfected the transition from legacy Inbound Marketing
            to <strong className="text-white">AI-Powered Journey Orchestration</strong>. We do not just
            get you seen. We get you mathematically verified.
          </p>
        </div>
        
        <div className="bg-[#111827] border border-gray-800 p-10 rounded-[2.5rem] shadow-2xl text-white relative min-h-[450px] flex flex-col justify-center">
          <div className="absolute top-0 left-0 w-full h-2 bg-yellow-500 rounded-t-[2.5rem]"></div>
          {submitted ? (
            <div className="text-center animate-fade-in">
              <ShieldCheck className="mx-auto text-yellow-500 mb-6" size={72} />
              <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Request Secured</h3>
              <p className="font-bold text-gray-400 mb-8 text-sm leading-relaxed max-w-sm mx-auto">
                Your intelligence brief has been dispatched to <strong className="text-white">{form.email}</strong>. The team is reviewing your entity data and will contact you shortly.
              </p>
              <button onClick={() => setSubmitted(false)} className="inline-block w-full bg-yellow-500 text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white transition-colors shadow-xl">
                Submit Another Request
              </button>
            </div>
          ) : (
            <div className="animate-fade-in">
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 mt-2">Initialize Your Audit</h3>
              <p className="font-bold text-gray-400 mb-8 text-sm">Select your required protocol below. We will capture your request and immediately initialize your AI Entity Scanner.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Full Name" required className="w-full bg-[#0a0a0a] text-white p-4 rounded-xl border border-gray-800 outline-none focus:border-yellow-500 font-bold placeholder:font-normal transition-all" onChange={e => setForm({...form, name: e.target.value})} />
                <div className="relative">
                  <select required defaultValue="" className="w-full bg-[#0a0a0a] text-white p-4 rounded-xl border border-gray-800 outline-none focus:border-yellow-500 font-bold transition-all appearance-none cursor-pointer" onChange={e => setForm({...form, service: e.target.value})}>
                    <option value="" disabled className="font-normal text-gray-500">Select Requested Architecture...</option>
                    {SERVICES_DATA.map(phase => (
                      <optgroup key={phase.phase} label={`Phase ${phase.phase}: ${phase.title}`}>
                        {phase.tiers.map(tier => (
                          <option key={tier.title} value={tier.title}>{tier.title}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-yellow-500"><ChevronDown size={20} /></div>
                </div>
                <input type="text" placeholder="Website URL (e.g. www.yourbrand.com)" required className="w-full bg-[#0a0a0a] text-white p-4 rounded-xl border border-gray-800 outline-none focus:border-yellow-500 font-bold placeholder:font-normal transition-all" onChange={e => setForm({...form, website: e.target.value})} />
                <input type="email" placeholder="Secure Email Address" required className="w-full bg-[#0a0a0a] text-white p-4 rounded-xl border border-gray-800 outline-none focus:border-yellow-500 font-bold placeholder:font-normal transition-all" onChange={e => setForm({...form, email: e.target.value})} />
                <button type="submit" disabled={loading} className="w-full bg-yellow-500 text-black py-5 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-white transition-colors mt-4 shadow-xl disabled:opacity-70 flex justify-center items-center gap-2">
                  {loading ? 'Transmitting Request...' : 'Request Service Protocol'} <Zap size={16} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
