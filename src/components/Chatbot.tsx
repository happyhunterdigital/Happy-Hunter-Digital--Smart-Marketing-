import { useState, useRef, useEffect } from 'react';
import { hunterAI } from '../lib/gemini';
import { MessageSquare, Send, X, Bot } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([{ role: 'bot', text: "Is your entity invisible? I am here to assist." }]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput("");
    setLoading(true);
    try {
      const chat = hunterAI.startChat({ history: [] });
      const result = await chat.sendMessage(userText);
      const res = await result.response;
      setMessages(prev => [...prev, { role: 'bot', text: res.text() }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "Signal drop. Use WhatsApp." }]);
    } finally { setLoading(false); }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[500px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="p-4 bg-yellow-500 text-slate-950 flex justify-between items-center font-bold">
            <div className="flex items-center gap-2"><Bot size={20}/> <span>Hunter AI</span></div>
            <button onClick={() => setIsOpen(false)}><X size={20}/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-xs ${m.role === 'user' ? 'bg-yellow-500 text-slate-950' : 'bg-slate-800 text-slate-200'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
          <div className="p-4 border-t border-slate-800 flex gap-2">
            <input className="flex-1 bg-slate-800 p-2 rounded-lg text-xs outline-none" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} />
            <button onClick={sendMessage} className="bg-yellow-500 p-2 rounded-lg text-slate-950"><Send size={18}/></button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-yellow-500 p-4 rounded-full shadow-xl"><MessageSquare size={24} /></button>
      )}
    </div>
  );
}
