import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X, MessageSquare } from 'lucide-react';
import { callHunterAI } from '../firebaseConfig'; // Updated import

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ id: 1, text: "Welcome. I am Hunter AI. Is your entity invisible to the smart filter?", sender: 'bot' }]);
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' as const };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const aiText = await callHunterAI(input);
    
    setMessages(prev => [...prev, { id: Date.now() + 1, text: aiText, sender: 'bot' }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-slate-950 w-80 md:w-96 rounded-3xl shadow-2xl border border-slate-800 flex flex-col h-[500px] overflow-hidden">
          <div className="bg-slate-900 p-5 flex justify-between items-center border-b border-slate-800">
            <div className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest">
              <Bot className="text-yellow-500" size={18} /> Hunter AI
            </div>
            <X className="text-slate-500 cursor-pointer hover:text-white transition-colors" onClick={() => setIsOpen(false)} />
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[85%] ${m.sender === 'user' ? 'bg-yellow-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && <p className="text-[10px] text-yellow-500 animate-pulse font-black uppercase">Thinking...</p>}
            <div ref={endRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input 
              className="flex-1 bg-slate-950 p-3 rounded-xl text-xs text-white outline-none border border-slate-800 focus:border-yellow-500 transition-colors"
              placeholder="Query the entity..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button className="bg-yellow-500 p-3 rounded-xl text-slate-950 hover:bg-yellow-400 transition-colors"><Send size={16} /></button>
          </form>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-yellow-500 text-slate-950 p-5 rounded-full shadow-xl hover:scale-110 transition-all border-4 border-slate-950">
          <MessageSquare size={28} />
        </button>
      )}
    </div>
  );
};
