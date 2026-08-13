import React, { useState, useEffect, useCallback } from 'react';
import { X, Download, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { functions } from '../firebaseConfig';
import { httpsCallable } from 'firebase/functions';

const submitPlaybookRequest = httpsCallable(functions, 'submitPlaybookRequest');

export const ExitIntentModal: React.FC = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    try {
      if (e.clientY <= 0 && !sessionStorage.getItem('exit_modal_seen')) {
        setShow(true);
      }
    } catch (e) { void e; }
  }, []);

  useEffect(() => {
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [handleMouseLeave]);

  const close = () => {
    setShow(false);
    try {
      sessionStorage.setItem('exit_modal_seen', 'true');
    } catch (e) { void e; }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !whatsapp.trim()) return;
    setLoading(true);
    setError('');
    try {
      await submitPlaybookRequest({ email: email.trim(), whatsapp: whatsapp.trim() });
      setSubmitted(true);
    } catch (err: any) {
      console.error("Playbook request failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-amber-500/30 rounded-3xl shadow-[0_0_60px_rgba(234,179,8,0.15)] overflow-hidden">
        <button
          onClick={close}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20 p-2 rounded-full bg-white/5"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="p-8 pt-10">
          {!submitted ? (
            <>
              <div className="flex justify-center mb-5">
                <div className="p-4 bg-amber-500/10 rounded-2xl">
                  <Download className="text-amber-500" size={32} />
                </div>
              </div>

              <span className="block text-center text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                Free Download
              </span>

              <h2 className="text-2xl font-black text-white uppercase tracking-tighter text-center mb-3">
                2026 AI Marketing Playbook
              </h2>

              <p className="text-gray-400 text-sm text-center mb-6 leading-relaxed">
                The exact strategies South African businesses use to get found by ChatGPT, Gemini, and Google AI Overviews. Includes GEO templates, schema checklists, and WhatsApp automation flows.
              </p>

              <ul className="space-y-2 mb-6">
                {[
                  'AI Search Optimization Checklist',
                  'WhatsApp Automation Blueprint',
                  'Schema Markup Templates',
                  'Local SEO vs AI-Ready Comparison',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300 text-xs">
                    <CheckCircle2 size={14} className="text-amber-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-white/5 text-white text-sm pl-11 pr-4 py-3.5 rounded-xl border border-white/10 focus:border-amber-500 outline-none transition-colors"
                  />
                </div>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="WhatsApp number (e.g. +27601016673)"
                    required
                    className="w-full bg-white/5 text-white text-sm pl-11 pr-4 py-3.5 rounded-xl border border-white/10 focus:border-amber-500 outline-none transition-colors"
                  />
                </div>
                {error && (
                  <p className="text-red-400 text-xs text-center">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-500 text-black py-3.5 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-amber-400 transition-all disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Download Free Playbook'}
                </button>
              </form>

              <p className="text-gray-600 text-[10px] text-center mt-4">
                No spam. Unsubscribe anytime. POPIA & GDPR compliant.
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="text-green-500" size={48} />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Check Your Inbox</h3>
              <p className="text-gray-400 text-sm mb-2">
                Your 2026 AI Marketing Playbook has been sent to <strong className="text-white">{email}</strong>.
              </p>
              {whatsapp && (
                <p className="text-gray-400 text-sm mb-2">
                  A download link has also been sent to your WhatsApp at <strong className="text-white">{whatsapp}</strong>.
                </p>
              )}
              <p className="text-gray-500 text-xs mb-6">
                Check your spam folder if you don't see it within 2 minutes.
              </p>
              <button
                onClick={close}
                className="px-8 py-3 bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
              >
                Continue Browsing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
