import { useState, useRef, useEffect } from 'react';
import { callHunterAI } from '../firebaseConfig'; 
import { MessageSquare, Send, X, Bot, Zap } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Signal established. I am Hunter AI. Is your entity currently invisible to the smart filter?" }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const responseText = await callHunterAI(userText);
      setMessages(prev => [...prev, { role: 'bot', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Signal drop. Book a call for support: https://calendly.com/motsumitl/30min" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[550px] bg-slate-950 border border-slate-800 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10">
          <div className="p-5 bg-yellow-500 text-slate-950 flex justify-between items-center font-bold">
            <div className="flex items-center gap-3">
              <Bot size={24}/> 
              <div className="flex flex-col leading-none">
                <span className="font-black uppercase tracking-tighter text-sm">Hunter AI</span>
                <span className="text-[8px] uppercase tracking-widest opacity-70 flex items-center gap-1">
                  <Zap size={8} fill="currentColor"/> Entity Intelligence
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={20}/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-yellow-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-[10px] text-yellow-500 font-bold animate-pulse uppercase">Processing...</div>}
            <div ref={scrollRef} />
          </div>
          <div className="p-4 border-t border-slate-900 flex gap-2">
            <input className="flex-1 bg-slate-950 p-4 rounded-xl text-xs outline-none border border-slate-800 focus:border-yellow-500" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Ask the ecosystem..." />
            <button onClick={sendMessage} className="bg-yellow-500 p-4 rounded-xl text-slate-950 hover:bg-yellow-400 transition-colors"><Send size={18}/></button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-yellow-500 text-slate-950 p-5 rounded-full shadow-xl hover:scale-110 transition-transform">
          <MessageSquare size={28} />
        </button>
      )}
    </div>
  );
}
