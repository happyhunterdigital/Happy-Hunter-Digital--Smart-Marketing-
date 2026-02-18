import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, WifiOff } from 'lucide-react';
import { getFirebaseStatus } from '../firebaseConfig';

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Simple response cache
const responseCache = new Map<string, string>();

// Fallback responses when AI is down
const fallbackResponses: Record<string, string> = {
  audit: 'I recommend running our Entity Scan tool. Click "Audit" in the navigation to get a full forensic analysis of your digital presence.',
  contact: 'You can reach Thabo directly at hello@happyhunterdigital.com or schedule a call via our Calendly link.',
  price: 'Our Entity Recovery Protocols are customized per business. Run the free audit first, then we\'ll discuss investment based on your specific visibility gaps.',
  hello: 'I am Hunter AI, digital entity strategist. How is your business performing in AI search?',
  help: 'I can help with: 1) Running a digital audit 2) Explaining our Entity Management methodology 3) Connecting you with Thabo. What do you need?',
  default: 'I\'m currently operating in limited mode. For immediate assistance, please run the Entity Scan tool or email hello@happyhunterdigital.com.'
};

const getFallbackResponse = (input: string): string => {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(fallbackResponses)) {
    if (lower.includes(key)) return response;
  }
  return fallbackResponses.default;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(!!GEMINI_API_KEY);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message
  useEffect(() => {
    setMessages([{
      role: 'model',
      text: GEMINI_API_KEY 
        ? 'I am Hunter AI. I diagnose digital invisibility. What entity are we assessing?'
        : 'I am Hunter AI [LIMITED MODE]. Ask about our audit tool or email hello@happyhunterdigital.com.',
      timestamp: new Date(),
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const callGemini = async (userMessage: string, history: string[]): Promise<string> => {
    if (!GEMINI_API_KEY) {
      return getFallbackResponse(userMessage);
    }

    // Check cache
    const cacheKey = userMessage.toLowerCase().trim();
    if (responseCache.has(cacheKey)) {
      return responseCache.get(cacheKey)!;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const prompt = `You are Hunter AI, autonomous strategist for Happy Hunter Digital (South African digital marketing agency specializing in Entity Management).

CONTEXT: You help businesses fix "digital invisibility" through Google Business Profile optimization, AEO (Answer Engine Optimization), and AI search readiness.

CONVERSATION HISTORY: ${history.slice(-4).map((h, i) => `${i % 2 === 0 ? 'User' : 'Hunter'}: ${h}`).join('\n')}

User: ${userMessage}

Hunter AI (respond in 1-2 sentences, authoritative tone, mention "Entity Scan" if relevant):`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.8, maxOutputTokens: 150 },
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('API error');

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        responseCache.set(cacheKey, text);
        return text;
      }
      
      throw new Error('Empty response');
    } catch (error) {
      console.error('Chatbot AI error:', error);
      setAiAvailable(false);
      return getFallbackResponse(userMessage);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    const userMessage: Message = {
      role: 'user',
      text: userMsg,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-6).map(m => m.text);
      const responseText = await callGemini(userMsg, history);
      
      const botMessage: Message = {
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'model',
        text: 'Signal interrupted. Please try again or email hello@happyhunterdigital.com',
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
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
          isOpen ? 'bg-red-500 rotate-90' : 'bg-yellow-500'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X size={24} className="text-white" /> : <MessageCircle size={24} className="text-slate-950" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-yellow-500 p-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-950 rounded-full flex items-center justify-center">
              <span className="text-yellow-500 font-black">H</span>
            </div>
            <div className="flex-1">
              <h4 className="font-black text-slate-950 uppercase text-xs">Hunter AI</h4>
              <p className="text-[10px] text-slate-800 font-bold flex items-center gap-1">
                {!aiAvailable && <WifiOff size={10} />}
                {aiAvailable ? 'Digital Entity Strategist' : 'Limited Mode'}
              </p>
            </div>
          </div>

          <div className="h-72 overflow-y-auto p-3 space-y-3 bg-slate-950/30">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-2.5 rounded-xl text-xs ${
                  msg.role === 'user'
                    ? 'bg-yellow-500 text-slate-950 font-medium'
                    : msg.isError 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-slate-800 text-slate-200'
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
                placeholder={aiAvailable ? "Deploy query..." : "Limited mode - try: audit, contact, price"}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-yellow-500"
                maxLength={200}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-yellow-500 text-slate-950 p-2 rounded-lg disabled:opacity-50 hover:bg-yellow-400 transition-colors"
                aria-label="Send message"
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
