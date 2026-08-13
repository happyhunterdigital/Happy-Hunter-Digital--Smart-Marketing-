import React, { useState, useEffect, useRef } from 'react';
import { X, Bot, Send, Loader2, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { functions } from '../firebaseConfig';
import { httpsCallable } from 'firebase/functions';
import { sanitizeHTML } from '../utils/sanitize';
import { moderateContent } from '../utils/moderate';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

type FlowStep = 'greet' | 'business' | 'timeline' | 'budget' | 'contact' | 'done' | 'ai';

interface Option {
  value: string;
  label: string;
}

const OPTIONS: Record<FlowStep, Option[]> = {
  greet: [
    { value: 'search', label: 'Find me on Google & AI' },
    { value: 'whatsapp', label: 'Sell more on WhatsApp' },
    { value: 'website', label: 'A modern website' },
    { value: 'marketing', label: 'Marketing & content' },
    { value: 'other', label: 'Something else' },
  ],
  business: [
    { value: 'local', label: 'Local shop or service' },
    { value: 'online', label: 'Online business' },
    { value: 'pro', label: 'Professional practice' },
    { value: 'hospitality', label: 'Restaurant or hospitality' },
    { value: 'other', label: 'Other' },
  ],
  timeline: [
    { value: 'month', label: 'This month' },
    { value: 'quarter', label: 'Within 3 months' },
    { value: 'exploring', label: 'Just exploring' },
  ],
  budget: [
    { value: 'r5', label: 'Under R5,000' },
    { value: 'r15', label: 'R5,000 – R15,000' },
    { value: 'r50', label: 'R15,000 – R50,000' },
    { value: 'unsure', label: 'Not sure yet' },
  ],
  contact: [],
  done: [],
  ai: [],
};

const SERVICE_LABELS: Record<string, string> = {
  search: 'Find me on Google & AI',
  whatsapp: 'Sell more on WhatsApp',
  website: 'A modern website',
  marketing: 'Marketing & content',
};

const BUDGET_LABELS: Record<string, string> = {
  r5: 'Under R5,000',
  r15: 'R5,000 – R15,000',
  r50: 'R15,000 – R50,000',
  unsure: 'Not sure yet',
};

const QUESTIONS: Partial<Record<FlowStep, string>> = {
  greet: 'Hi, I’m the <strong>Smart Marketing assistant</strong>.<br/>Let’s find the right help for your business — just tap an option below.',
  business: 'Great choice. <strong>Which best describes your business?</strong>',
  timeline: 'Perfect. <strong>How soon would you like to get started?</strong>',
  budget: 'Almost there. <strong>What budget are you working with?</strong>',
  contact: 'You’re all set — last thing, we just need somewhere to send your plan. It takes 10 seconds.',
};

const NEXT_STEP: Partial<Record<FlowStep, FlowStep>> = {
  greet: 'business',
  business: 'timeline',
  timeline: 'budget',
  budget: 'contact',
};

const escapeHTML = (s: string) =>
  s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

export const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: QUESTIONS.greet! },
  ]);
  const [step, setStep] = useState<FlowStep>('greet');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [pendingOption, setPendingOption] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactWa, setContactWa] = useState('');
  const [contactError, setContactError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, step, pendingOption]);

  const botSay = (text: string) => setMessages(prev => [...prev, { role: 'bot', text }]);
  const userSay = (text: string) => setMessages(prev => [...prev, { role: 'user', text }]);

  const advance = (option: Option) => {
    if (pendingOption || loading) return;
    setPendingOption(option.value);

    setTimeout(() => {
      setPendingOption(null);

      if (step === 'greet' && option.value === 'other') {
        userSay(option.label);
        botSay('No problem. Ask me anything about your business and I’ll do my best to help — type below.');
        setStep('ai');
        return;
      }

      if (step === 'greet') {
        setAnswers(prev => ({ ...prev, service: option.value }));
      } else if (step === 'business') {
        setAnswers(prev => ({ ...prev, business: option.label }));
      } else if (step === 'timeline') {
        setAnswers(prev => ({ ...prev, timeline: option.label }));
      } else if (step === 'budget') {
        setAnswers(prev => ({ ...prev, budget: option.value }));
      }

      userSay(option.label);
      const next = NEXT_STEP[step];
      if (next) {
        botSay(QUESTIONS[next]!);
        setStep(next);
      }
    }, 260);
  };

  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactWa.trim()) {
      setContactError('Please add your name and WhatsApp number.');
      return;
    }
    if (loading) return;
    setContactError('');
    setLoading(true);
    userSay(`${contactName.trim()} · ${contactWa.trim()}`);

    try {
      const submitLead = httpsCallable(functions, 'submitChatbotLead');
      await submitLead({
        name: contactName.trim(),
        whatsapp: contactWa.trim(),
        service: SERVICE_LABELS[answers.service] || 'General enquiry',
        business: answers.business || null,
        timeline: answers.timeline || null,
        budget: BUDGET_LABELS[answers.budget] || null,
      });
      setStep('done');
      botSay(
        `<p style="text-align:center;margin:0 0 10px;"><span style="display:inline-flex;align-items:center;gap:8px;font-weight:800;color:#22c55e;font-size:15px;">✓ Done!</span></p>` +
        `<p>Thanks, <strong>${escapeHTML(contactName.trim())}</strong>. Your plan has been saved and a strategist will be in touch within 24 hours on <strong>${escapeHTML(contactWa.trim())}</strong>.</p>`
      );
    } catch {
      botSay('Something went wrong saving your details. Please try again, or message us on <a href="https://wa.me/27601016673" target="_blank" rel="noopener noreferrer">WhatsApp</a>.');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    if (userMsg.length > 500) {
      botSay('That message is a bit long. Could you keep it under 500 characters?');
      return;
    }
    if (!moderateContent(userMsg).clean) {
      botSay('Let’s keep the conversation professional and on-topic — could you rephrase that?');
      return;
    }

    setInput('');
    userSay(userMsg);
    setLoading(true);

    try {
      const hunterChatCall = httpsCallable(functions, 'hunterChat');
      const response = await hunterChatCall({
        message: userMsg,
        history: messages,
      }) as any;
      const replyText = response.data?.reply || 'I didn’t quite catch that. Could you rephrase?';
      botSay(replyText);
    } catch {
      botSay('I hit a temporary connection issue. Please retry, or message us on <a href="https://wa.me/27601016673" target="_blank" rel="noopener noreferrer">WhatsApp</a>.');
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setMessages([{ role: 'bot', text: QUESTIONS.greet! }]);
    setStep('greet');
    setAnswers({});
    setContactName('');
    setContactWa('');
    setContactError('');
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close chatbot' : 'Open chatbot'}
        className="fixed bottom-6 right-6 z-[150] bg-yellow-500 text-black p-0 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:scale-110 transition-transform w-14 h-14 overflow-hidden"
      >
        {open ? <X size={24} className="m-4" /> : <Bot size={26} className="m-4" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-[150] w-[calc(100vw-3rem)] sm:w-80 md:w-96 bg-[#0a0a0a] border border-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[640px] animate-fade-in">
          <div className="bg-black px-5 py-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-yellow-500/15 flex items-center justify-center">
                <Sparkles className="text-yellow-500" size={18} />
              </div>
              <div>
                <span className="block font-bold text-white text-[13px] leading-tight uppercase tracking-wider">Smart Marketing AI</span>
                <span className="flex items-center gap-1.5 text-[11px] text-gray-500 leading-tight">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Online
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-black/50 scrollbar-hide" style={{ minHeight: 280 }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] min-w-0 px-4 py-3 rounded-2xl text-sm leading-relaxed transition-all ${
                    m.role === 'user'
                      ? 'bg-yellow-500 text-black font-medium rounded-br-md'
                      : 'bg-gray-900 text-gray-200 rounded-bl-md [&_a]:text-yellow-500 [&_a]:font-bold'
                  }`}
                  style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(m.text) }}
                />
              </div>
            ))}

            {/* Multiple-choice options — one click per step */}
            {!['ai', 'done'].includes(step) && OPTIONS[step].length > 0 && (
              <div className="flex flex-col gap-2.5 pl-1">
                {OPTIONS[step].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => advance(opt)}
                    disabled={!!pendingOption}
                    className="group flex items-center justify-between gap-3 text-left px-4 py-3.5 rounded-2xl bg-gray-900 border border-gray-800 text-gray-100 text-sm font-semibold hover:border-yellow-500 hover:text-white hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-60 disabled:pointer-events-none"
                  >
                    {opt.label}
                    {pendingOption === opt.value ? (
                      <Loader2 size={16} className="text-yellow-500 animate-spin shrink-0" />
                    ) : (
                      <ArrowRight size={16} className="text-gray-600 group-hover:text-yellow-500 transition-colors shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Contact step — contact info requested last */}
            {step === 'contact' && (
              <form onSubmit={submitContact} className="flex flex-col gap-2.5 pl-1">
                <input
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3.5 rounded-2xl bg-gray-900 border border-gray-800 text-white text-sm placeholder:text-gray-600 focus:border-yellow-500 outline-none transition-colors"
                />
                <input
                  value={contactWa}
                  onChange={e => setContactWa(e.target.value)}
                  placeholder="WhatsApp number (e.g. 060 101 6673)"
                  inputMode="tel"
                  className="w-full px-4 py-3.5 rounded-2xl bg-gray-900 border border-gray-800 text-white text-sm placeholder:text-gray-600 focus:border-yellow-500 outline-none transition-colors"
                />
                {contactError && <p className="text-red-400 text-xs">{contactError}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-2xl bg-yellow-500 text-black font-black uppercase text-xs tracking-widest hover:bg-yellow-400 active:scale-[0.98] transition-all disabled:opacity-60"
                >
                  {loading ? <><Loader2 size={15} className="animate-spin" /> Sending…</> : 'Send my plan'}
                </button>
              </form>
            )}

            {/* Done — green checkmark confirmation */}
            {step === 'done' && (
              <div className="flex flex-col items-center gap-3 py-2 pl-1">
                <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center animate-pop">
                  <CheckCircle2 className="text-green-500" size={30} />
                </div>
                <button
                  onClick={() => { setOpen(false); setTimeout(() => window.location.assign('/audit'), 0); }}
                  className="text-xs font-bold text-yellow-500 hover:text-white transition-colors uppercase tracking-widest"
                >
                  Run the free online health check →
                </button>
                <button
                  onClick={resetFlow}
                  className="text-[11px] text-gray-500 hover:text-white transition-colors underline"
                >
                  Start a new enquiry
                </button>
              </div>
            )}

            {loading && step === 'ai' && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 bg-gray-900 text-gray-400 text-xs px-4 py-3 rounded-2xl">
                  <Loader2 className="animate-spin" size={13} /> Typing…
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {step === 'ai' && (
            <form onSubmit={sendMessage} className="px-4 py-3 bg-gray-900/40 border-t border-gray-800 flex gap-2 items-center">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your question…"
                className="flex-1 bg-black text-white text-sm px-4 py-3 rounded-2xl border border-gray-800 focus:border-yellow-500 outline-none disabled:opacity-50 min-w-0"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="w-11 h-11 bg-yellow-500 text-black rounded-2xl flex items-center justify-center hover:bg-yellow-400 disabled:opacity-50 transition-colors shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
};