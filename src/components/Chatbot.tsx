import { useState, useRef, useEffect } from 'react';
import { callHunterAI } from '../firebaseConfig'; 
import { MessageSquare, Send, X, Bot } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Signal established. I am Hunter AI. Is your business currently invisible to the smart filter?" }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput("");
    setLoading(true);

    const responseText = await callHunterAI(userText);
    setMessages(prev => [...prev, { role: 'bot', text: responseText }]);
    setLoading(false);
  }

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[500px] bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10">
          <div className="p-5 bg-yellow-500 text-slate-950 flex justify-between items-center font-bold">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest">
              <Bot size={18}/> <span>Hunter AI</span>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={20}/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-yellow-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-[10px] text-yellow-500 font-bold animate-pulse uppercase">Analyzing...</div>}
            <div ref={scrollRef} />
          </div>
          <div className="p-4 border-t border-slate-900 flex gap-2">
            <input className="flex-1 bg-slate-950 p-3 rounded-xl text-xs outline-none border border-slate-800 focus:border-yellow-500" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Ask the ecosystem..." />
            <button onClick={sendMessage} className="bg-yellow-500 p-3 rounded-xl text-slate-950 hover:bg-yellow-400 transition-colors"><Send size={16}/></button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-yellow-500 text-slate-950 p-5 rounded-full shadow-xl hover:scale-110 transition-all border-4 border-slate-950">
          <MessageSquare size={28} />
        </button>
      )}
    </div>
  );
}
