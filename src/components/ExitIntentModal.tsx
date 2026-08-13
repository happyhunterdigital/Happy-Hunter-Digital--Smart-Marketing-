import React, { useState, useEffect, useCallback } from 'react';
import { X, ArrowRight, ArrowLeft, Mail, Phone, CheckCircle2, FileText } from 'lucide-react';
import { functions } from '../firebaseConfig';
import { httpsCallable } from 'firebase/functions';
import { Telemetry } from '../posthog';

const submitPlaybookRequest = httpsCallable(functions, 'submitPlaybookRequest');

// Each computer can download the playbook twice. Counters are stored on the
// device itself (same approach as the free audit limit).
const PLAYBOOK_LIMIT = 2;
const PLAYBOOK_COUNT_KEY = 'hhd_playbook_count';

const getPlaybookCount = (): number => {
  try {
    return parseInt(localStorage.getItem(PLAYBOOK_COUNT_KEY) || '0', 10) || 0;
  } catch (e) {
    void e;
    return 0;
  }
};

const setPlaybookCount = (count: number) => {
  try {
    localStorage.setItem(PLAYBOOK_COUNT_KEY, String(count));
  } catch (e) {
    void e;
  }
};

const EASE = 'ease-[cubic-bezier(0.32,0.72,0,1)]';

export const ExitIntentModal: React.FC = () => {
  const [show, setShow] = useState(false);
  const [view, setView] = useState<'cta' | 'form'>('cta');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    try {
      if (e.clientY <= 0 && !sessionStorage.getItem('exit_modal_seen')) {
        setView('cta');
        setSubmitted(false);
        setError('');
        setShow(true);
      }
    } catch (e) { void e; }
  }, []);

  useEffect(() => {
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [handleMouseLeave]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    if (show) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [show]);

  const close = () => {
    setShow(false);
    try {
      sessionStorage.setItem('exit_modal_seen', 'true');
    } catch (e) { void e; }
  };

  // Primary path: take the Free Online Business Health Check to unlock the
  // playbook. The audit completion auto-sends the playbook to the lead.
  const startHealthCheck = () => {
    Telemetry.healthCheckStarted();
    close();
    setTimeout(() => window.location.assign('/audit'), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !whatsapp.trim()) return;

    const usedCount = getPlaybookCount();
    if (usedCount >= PLAYBOOK_LIMIT) {
      setError(`You've already downloaded the playbook ${PLAYBOOK_LIMIT} times on this computer. Check your inbox or WhatsApp for the link.`);
      return;
    }

    setLoading(true);
    setError('');
    try {
      await submitPlaybookRequest({ email: email.trim(), whatsapp: whatsapp.trim() });
      setPlaybookCount(usedCount + 1);
      setSubmitted(true);
    } catch (err: any) {
      console.error("Playbook request failed:", err);
      const msg = String(err?.message || '');
      if (msg.includes('resource-exhausted') || msg.includes('already received')) {
        setPlaybookCount(PLAYBOOK_LIMIT);
        setError(`You've already downloaded the playbook ${PLAYBOOK_LIMIT} times. Check your inbox or WhatsApp for the link.`);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Free Online Business Health Check and 2026 AI Marketing Playbook"
    >
      {/* Double-bezel shell: outer housing + inner core */}
      <div className="relative w-full max-w-lg p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/10">
        <div className="relative rounded-[calc(2rem-0.375rem)] bg-[#0a0a0a] border border-yellow-500/25 overflow-hidden shadow-[0_0_90px_rgba(234,179,8,0.14)]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-amber-400 to-orange-500"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,_rgba(234,179,8,0.14)_0%,_transparent_55%)] pointer-events-none"></div>

          <button
            onClick={close}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20 p-2 rounded-full bg-white/5 hover:bg-white/10"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div className="relative p-8 md:p-10">
            {!submitted && view === 'cta' && (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 font-mono text-[10px] uppercase tracking-[0.25em] text-yellow-500 mb-6">
                  <FileText size={12} /> Free Download
                </div>

                <h2 className="font-display font-black text-white uppercase tracking-tight leading-[1.05] text-[26px] md:text-[32px] mb-4 [text-wrap:balance]">
                  Get the 2026 AI Marketing<br className="hidden md:block" /> Playbook — Free
                </h2>

                <p className="text-gray-400 text-sm md:text-[15px] leading-relaxed max-w-sm mx-auto mb-7 [text-wrap:pretty]">
                  Run your <span className="text-white font-semibold">Free Online Business Health Check</span> and see exactly why customers can't find you on Google, ChatGPT, and WhatsApp. Your playbook lands in your inbox — free.
                </p>

                {/* PRIMARY CTA — large enough to hold the full label, contained within the modal */}
                <button
                  onClick={startHealthCheck}
                  className={`group relative w-full overflow-hidden rounded-2xl bg-yellow-500 px-6 py-4 text-black transition-all duration-700 ${EASE} hover:bg-white active:scale-[0.98] flex items-center justify-center gap-3`}
                >
                  <span className="font-display font-bold uppercase tracking-tight text-[15px] md:text-[17px] leading-snug [text-wrap:balance] text-center">
                    Free Online Business Health Check
                  </span>
                  <span
                    className={`shrink-0 w-9 h-9 rounded-full bg-black/10 flex items-center justify-center transition-all duration-700 ${EASE} group-hover:translate-x-1 group-hover:bg-black/5`}
                  >
                    <ArrowRight size={16} className="text-black" />
                  </span>
                </button>

                <div className="flex items-center justify-center gap-2 mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  <span>60-Second Check</span>
                  <span className="text-yellow-500">·</span>
                  <span>No Card</span>
                  <span className="text-yellow-500">·</span>
                  <span>No Obligation</span>
                </div>

                <div className="mt-6 border-t border-white/5 pt-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-600 mb-3">// Inside the Playbook</p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {[
                      'GEO Templates',
                      'Schema Checklists',
                      'WhatsApp Flows',
                      'AI Visibility Prompts',
                    ].map((item, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[11px] font-mono">
                        <CheckCircle2 size={11} className="text-yellow-500" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => { setView('form'); setError(''); }}
                    className="group inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    Already ran your health check? Get it sent to your inbox
                    <ArrowRight size={13} className="transition-transform duration-500 group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            )}

            {!submitted && view === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-center gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => { setView('cta'); setError(''); }}
                    className="shrink-0 p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-yellow-500/40 transition-colors"
                    aria-label="Back"
                  >
                    <ArrowLeft size={14} />
                  </button>
                  <div className="text-left">
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-yellow-500 mb-1">Playbook Delivery</p>
                    <h3 className="font-display font-black text-white uppercase tracking-tight text-lg leading-none">Get It In Your Inbox</h3>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 space-y-3">
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full bg-white/5 text-white text-sm pl-11 pr-4 py-3.5 rounded-xl border border-white/10 focus:border-yellow-500 outline-none transition-colors"
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
                      className="w-full bg-white/5 text-white text-sm pl-11 pr-4 py-3.5 rounded-xl border border-white/10 focus:border-yellow-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-xs text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-500 text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Me the Free Playbook'}
                </button>

                <p className="text-gray-600 text-[10px] text-center">
                  No spam. Unsubscribe anytime. POPIA & GDPR compliant.
                </p>
              </form>
            )}

            {submitted && (
              <div className="text-center py-4">
                <div className="flex justify-center mb-4">
                  <span className="relative flex h-16 w-16 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500/20 opacity-75"></span>
                    <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 border border-green-500/40">
                      <CheckCircle2 className="text-green-500" size={28} />
                    </span>
                  </span>
                </div>
                <h3 className="font-display text-xl font-black text-white uppercase tracking-tighter mb-2">Check Your Inbox</h3>
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
    </div>
  );
};