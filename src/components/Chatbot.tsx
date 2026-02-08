// src/components/Chatbot.tsx
import { useState, useRef, useEffect } from 'react';
import { callHunterAI } from '../firebaseConfig'; 
import { MessageSquare, Send, X, Bot, Calendar } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      text: "Welcome to Smart Marketing. I am Hunter, lead strategist here.\n\nI advise South African businesses on:\n• Digital Entity Architecture\n• Local Market Dominance\n• AI Visibility Systems\n• Revenue Recovery Protocols\n\nWhat challenge is your business facing?\n\nOr ask me about our upcoming session at the Integrated Wellth Summit on 28 February." 
    }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [messages]);

  const isSummitQuery = (text: string) => {
    const keywords = ['summit', 'integrated wellth', 'february', '28', 'event', 'session', 'thabo', 'motsumi', 'speaking', 'workshop'];
    return keywords.some(k => text.toLowerCase().includes(k));
  };

  const getSummitResponse = () => {
    return `The Integrated Wellth Summit 2026 is happening on 28 February. Smart Marketing has been invited to lead a high-impact session.

Thabo Leslie Motsumi will be guiding business owners through:

AI-Powered Marketing
Streamlined campaigns that personalize engagement and drive measurable results without technical complexity.

Automation Frameworks  
Reliable workflows that save time and ensure your operations run consistently.

Google Business Profile Optimization
Turning your profile into a conversion engine using Q&A, FAQs, offers, and strategic updates that dominate local search.

This session is built for non-technical business owners who want actionable growth strategies without the overwhelm.

Would you like details on attending?`;
  };

  async function sendMessage() {
    if (!input.trim() || loading) return;
    
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput("");
    setLoading(true);
    
    // Check if user is asking about the summit first
    if (isSummitQuery(userText)) {
      setMessages(prev => [...prev, { role: 'bot', text: getSummitResponse() }]);
      setLoading(false);
      return;
    }
    
    const systemPrompt = `You are Hunter, a senior digital strategist at Smart Marketing South Africa. You speak with authority and directness. You never use asterisks, markdown, or robotic language. You write like a seasoned consultant advising a business owner. Be concise, strategic, and actionable. Never mention being AI.

IMPORTANT CONTEXT:
- Smart Marketing (Happy Hunter Digital) is presenting at the Integrated Wellth Summit on 28 February 2026
- Thabo Leslie Motsumi is the founder and lead strategist
- The session covers: AI-Powered Marketing, Automation Frameworks, and Google Business Profile Optimization
- The target audience is non-technical SME owners who want practical growth strategies

If the user asks about events, speaking, the summit, or Thabo's sessions, provide details about the Integrated Wellth Summit.

User: ${userText}`;
    
    const responseText = await callHunterAI(systemPrompt);
    // Clean any accidental formatting
    const cleanText = responseText
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/As an AI/g, 'As a strategist')
      .replace(/I am an AI/g, 'I am a strategist')
      .replace(/I am an artificial intelligence/g, 'I am a strategist');
      
    setMessages(prev => [...prev, { role: 'bot', text: cleanText }]);
    setLoading(false);
  }

  return (
    <div className="fixed bottom-6 right-6 z-[90]">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[550px] bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          <div className="p-5 bg-yellow-500 text-slate-950 flex justify-between items-center">
            <div className="flex flex-col leading-none">
              <span className="font-black uppercase tracking-tighter text-sm flex items-center gap-2">
                <Bot size={16}/> Hunter
              </span>
              <span className="text-[8px] uppercase tracking-widest opacity-70 mt-1 font-black">
                Smart Marketing
              </span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
              <X size={20}/>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-950">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-4 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user' 
                    ? 'bg-yellow-500 text-slate-950 font-bold' 
                    : 'bg-slate-900 text-slate-300 border border-slate-800'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-[10px] text-yellow-500 font-bold animate-pulse uppercase tracking-widest ml-2">
                Considering...
              </div>
            )}
            <div ref={scrollRef} />
          </div>
          
          <div className="p-4 border-t border-slate-900 flex gap-2 bg-slate-950">
            <input 
              className="flex-1 bg-slate-900 p-3 rounded-xl text-xs border border-slate-800 focus:border-yellow-500 text-white outline-none" 
              placeholder="Describe your situation..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()} 
            />
            <button 
              onClick={sendMessage} 
              className="bg-yellow-500 p-3 rounded-xl text-slate-950 hover:bg-yellow-400 transition-colors"
            >
              <Send size={16}/>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)} 
          className="group bg-yellow-500 text-slate-950 p-5 rounded-full shadow-xl hover:scale-110 transition-all border-4 border-slate-950 relative"
        >
          <MessageSquare size={28} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-950 animate-pulse" title="Ask about the Integrated Wellth Summit" />
        </button>
      )}
    </div>
  );
}
