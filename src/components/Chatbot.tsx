// src/components/Chatbot.tsx
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

const FALLBACK_RESPONSES: Record<string, string> = {
  audit: 'Run our free Entity Scan to diagnose your digital invisibility. Click "Analyze Business" in the navigation.',
  contact: 'Email Thabo directly at hello@happyhunterdigital.com or WhatsApp +27(0)601016673.',
  price: 'Investment starts at R3,800 for the Entity Recovery Protocol. Run the audit first for a custom quote.',
  hello: 'I am Hunter AI. I diagnose why South African businesses are invisible to AI search engines.',
  help: 'I can help with: 1) Digital Entity Audits 2) Google Business Profile optimization 3) AI Search readiness. What do you need?',
  default: 'For immediate assistance, email hello@happyhunterdigital.com or run the free Entity Scan.'
};

const findResponse = (input: string): string => {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(FALLBACK_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  return FALLBACK_RESPONSES.default;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: 'model',
    text: 'I am Hunter AI [STANDBY MODE]. Ask about audits, contact info, or pricing.',
    timestamp: new Date(),
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, {
      role: 'user',
      text: userMsg,
      timestamp: new Date(),
    }]);
    setInput('');
    setLoading(true);

    // Simulate processing
    setTimeout(() => {
      const response = findResponse(userMsg);
      setMessages(prev => [...prev, {
        role: 'model',
        text: response,
        timestamp: new Date(),
      }]);
      setLoading(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all hover:scale-110 ${
          isOpen ? 'bg-red-500' : 'bg-yellow-500'
        }`}
      >
        {isOpen ? <X size={24} className="text-white" /> : <MessageCircle size={24} className="text-slate-950" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-yellow-500 p-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-950 rounded-full flex items-center justify-center">
              <span className="text-yellow-500 font-black">H</span>
            </div>
            <div>
              <h4 className="font-black text-slate-950 uppercase text-xs">Hunter AI</h4>
              <p className="text-[10px] text-slate-800 font-bold">Digital Strategist</p>
            </div>
          </div>

          <div className="h-72 overflow-y-auto p-3 space-y-3 bg-slate-950/30">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-2.5 rounded-xl text-xs ${
                  msg.role === 'user' ? 'bg-yellow-500 text-slate-950' : 'bg-slate-800 text-slate-200'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-2 rounded-xl">
                  <Loader2 className="animate-spin text-yellow-500" size={14} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-slate-800 bg-slate-900">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about audits, pricing..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-yellow-500"
                maxLength={200}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-yellow-500 text-slate-950 p-2 rounded-lg disabled:opacity-50"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
