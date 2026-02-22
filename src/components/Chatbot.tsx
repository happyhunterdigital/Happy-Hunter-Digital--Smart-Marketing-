import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';
import { functions } from '../firebaseConfig';
import { httpsCallable } from 'firebase/functions';

export const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'bot', text: 'Protocol initialized. I am Hunter AI. How can I help you dominate the AI search era?' }]);
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
      const hunterChat = httpsCallable(functions, 'hunterChat');
      const response = await hunterChat({ message: userMsg });
      const data = response.data as { reply: string };

      setMessages(prev => [...prev, {
        role: 'bot',
        text: data.reply || "Signal interference. Please retry."
      }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, {
        role: 'bot',
        text: "Comms link offline. Please email HQ at hello@happyhunterdigital.com"
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} className="fixed bottom-6 right-6 z-[150] bg-yellow-500 text-black p-4 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:scale-110 transition-transform">
        {open ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-[150] w-80 md:w-96 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[600px] animate-fade-in">
          <div className="bg-black p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="text-yellow-500" size={20} />
              <span className="font-bold text-white text-sm uppercase tracking-wider">Hunter AI</span>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto h-80 space-y-4 bg-black/50 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${m.role === 'user' ? 'bg-yellow-500 text-black font-medium' : 'bg-gray-800 text-gray-300'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-500 text-xs p-3 rounded-xl flex items-center gap-2">
                  <Loader2 className="animate-spin" size={14} /> Computing response...
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          <form onSubmit={sendMessage} className="p-3 bg-gray-900 border-t border-gray-800 flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter command..." className="flex-1 bg-black text-white text-sm p-3 rounded-lg border border-gray-800 focus:border-yellow-500 outline-none" disabled={loading} />
            <button type="submit" disabled={loading || !input.trim()} className="text-yellow-500 hover:text-white p-3 disabled:opacity-50 transition-colors">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
