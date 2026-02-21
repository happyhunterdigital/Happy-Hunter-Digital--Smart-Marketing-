import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';
import { hunterModel } from '../firebaseConfig';

export const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'bot', text: 'Protocol initialized. Awaiting command.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const prompt = `You are Hunter AI, strategic assistant for Happy Hunter Digital. User says: "${userMsg}". Respond in 1-2 sentences with military-grade precision.`;
      const result = await hunterModel.generateContent(prompt);
      const response = await result.response;
      setMessages(prev => [...prev, { role: 'bot', text: response.text() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Signal interference. Please email HQ." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} className="fixed bottom-6 right-6 z-[150] bg-yellow-500 text-black p-4 rounded-full shadow-2xl hover:scale-110 transition-transform">
        {open ? <X /> : <MessageSquare />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-[150] w-80 md:w-96 bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[500px] animate-fade-in">
          <div className="bg-black p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="text-yellow-500" size={20} />
              <span className="font-bold text-white text-xs uppercase tracking-wider">Hunter AI</span>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto h-80 space-y-4 bg-black/50 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${m.role === 'user' ? 'bg-yellow-500 text-black font-bold' : 'bg-gray-800 text-gray-300'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-gray-500 text-[10px] animate-pulse">Analyzing Signal...</div>}
            <div ref={scrollRef} />
          </div>
          <form onSubmit={sendMessage} className="p-3 bg-gray-900 border-t border-gray-800 flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter command..." className="flex-1 bg-black text-white text-xs p-3 rounded-xl border border-gray-800 focus:border-yellow-500 outline-none" />
            <button type="submit" disabled={loading} className="text-yellow-500 p-2"><Send size={18} /></button>
          </form>
        </div>
      )}
    </>
  );
};
