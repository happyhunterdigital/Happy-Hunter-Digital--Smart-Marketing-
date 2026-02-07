// src/components/Chatbot.tsx
import { useState, useRef, useEffect } from 'react';
import { callHunterAI } from '../firebaseConfig'; 
import { MessageSquare, Send, X, Bot, Sparkles } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      text: "👋 Welcome to Smart Marketing. I'm Hunter AI, powered by Gemini 2.5 Flash.\n\nI can help you with:\n• Digital Entity Audits\n• Local SEO strategy\n• AI Visibility (AEO)\n• Social Media positioning\n\nWhat business challenge are you facing today?" 
    }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [messages]);

  const generateSystemPrompt = (userMessage: string) => {
    return `You are Hunter AI, the strategic assistant for Smart Marketing (smartmarketing.co.za). 
You help South African business owners understand digital marketing, entity SEO, and AI visibility.

CONTEXT:
- Smart Marketing specializes in Entity Trust, Mirror Rule compliance, and Answer Engine Optimization (AEO)
- You are powered by Google's Gemini 2.5 Flash model
- Tone: Professional, direct, South African market expert, slightly provocative but helpful
- Always emphasize the cost of invisibility in the AI era
- If they need a full audit, direct them to the Entity Scan tool

USER QUERY: ${userMessage}

Provide a concise, actionable response. If they ask about pricing or booking, send them to https://calendly.com/motsumitl/30min`;
  };

  async function sendMessage() {
    if (!input.trim() || loading) return;
    
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const systemPrompt = generateSystemPrompt(userText);
      const responseText = await callHunterAI(systemPrompt);
      
      if (responseText.includes("SYSTEM_ERROR") || responseText.includes("CONNECTION_ERROR")) {
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: "⚠️ I'm experiencing technical difficulties. Please try again in a moment, or book a direct consultation:\n\nhttps://calendly.com/motsumitl/30min" 
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: responseText }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: "⚠️ Signal interrupted. Please book a direct consultation:\n\nhttps://calendly.com/motsumitl/30min" 
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[90]">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[600px] bg-slate-950 border-2 border-slate-800 rounded-3xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-5 bg-yellow-500 text-slate-950 flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-slate-950 p-2 rounded-lg">
                <Bot size={20} className="text-yellow-500"/>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black uppercase tracking-tighter text-sm">Hunter AI</span>
                <span className="text-[9px] uppercase tracking-widest opacity-80 mt-1 font-bold flex items-center gap-1">
                  <Sparkles size={10} /> Smart Marketing
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:rotate-90 transition-transform p-2 hover:bg-slate-950/10 rounded-full"
            >
              <X size={20}/>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-950">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[90%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                    m.role === 'user' 
                      ? 'bg-yellow-500 text-slate-950 font-bold rounded-br-none' 
                      : 'bg-slate-900 text-slate-300 border border-slate-800 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex items-center gap-2 text-yellow-500 ml-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.1s]" />
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="text-[10px] font-bold uppercase tracking-widest ml-2">Reasoning...</span>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t-2 border-slate-900 flex gap-2 bg-slate-950">
            <input 
              className="flex-1 bg-slate-900 p-4 rounded-xl text-sm border-2 border-slate-800 focus:border-yellow-500 text-white outline-none transition-all placeholder:text-slate-600" 
              placeholder="Ask about your digital entity..."
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={loading}
            />
            <button 
              onClick={sendMessage} 
              disabled={loading || !input.trim()}
              className="bg-yellow-500 p-4 rounded-xl text-slate-950 hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18}/>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)} 
          className="group bg-yellow-500 text-slate-950 p-5 rounded-full shadow-2xl shadow-yellow-500/20 hover:scale-110 transition-all border-4 border-slate-950 relative"
        >
          <MessageSquare size={28} />
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-950 animate-pulse" />
        </button>
      )}
    </div>
  );
}
