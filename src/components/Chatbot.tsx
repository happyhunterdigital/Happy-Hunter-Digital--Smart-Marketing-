import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

export const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'bot', text: 'Protocol initialized. Awaiting command.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const CHAT_ENDPOINT = `https://us-central1-${PROJECT_ID}.cloudfunctions.net/hunterChat`;

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.reply || "Signal interference." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Comms link offline. Please email HQ." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-brand-yellow text-brand-dark p-4 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:scale-110 transition-transform"
      >
        {open ? <X /> : <MessageSquare />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-brand-dark border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[600px] animate-fade-in">
          <div className="bg-gray-900 p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="text-brand-yellow" size={20} />
              <span className="font-bold text-white text-sm uppercase tracking-wider">Hunter AI</span>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto h-80 space-y-4 bg-black/50 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${m.role === 'user' ? 'bg-brand-yellow text-brand-dark font-medium' : 'bg-gray-800 text-gray-300'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-gray-500 text-xs animate-pulse">Computing response...</div>}
            <div ref={scrollRef} />
          </div>

          <form onSubmit={sendMessage} className="p-3 bg-gray-900 border-t border-gray-800 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter command..."
              className="flex-1 bg-gray-950 text-white text-sm p-2 rounded border border-gray-800 focus:border-brand-yellow outline-none"
            />
            <button type="submit" disabled={loading} className="text-brand-yellow hover:text-white p-2">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
