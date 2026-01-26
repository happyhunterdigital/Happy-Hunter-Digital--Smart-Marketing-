import React, { useState, useRef, useEffect } from 'react';
import { getChatSession } from '../services/geminiService';
import { Bot, X, Send } from 'lucide-react';
import { Message, GenerativeChat } from '../types';

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatSession = useRef<GenerativeChat | null>(null);

  useEffect(() => {
    if (isOpen && !chatSession.current) {
      const session = getChatSession();
      if (session) {
        chatSession.current = session as unknown as GenerativeChat;
        setMessages([{ id: 1, text: 'Hello! I am Hunter AI. How can I help?', sender: 'bot' }]);
      }
    }
  }, [isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatSession.current) return;
    const userText = input;
    setInput("");
    setMessages(prev => [...prev, { id: Date.now(), text: userText, sender: 'user' }]);
    setLoading(true);
    try {
      const result = await chatSession.current.sendMessage(userText);
      const text = result.response.text();
      setMessages(prev => [...prev, { id: Date.now() + 1, text, sender: 'bot' }]);
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: 'Connection error.', sender: 'bot' }]);
    }
    setLoading(false);
  };

  if (!isOpen) return <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 bg-yellow-500 text-black p-4 rounded-full font-bold shadow-2xl hover:scale-105 transition-transform">Ask Hunter</button>;

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-slate-800 rounded-xl border border-slate-700 z-50 overflow-hidden shadow-2xl">
      <div className="bg-slate-900 p-4 flex justify-between items-center text-white border-b border-slate-700">
        <div className="font-bold flex items-center gap-2"><Bot className="text-yellow-500" size={18}/> Hunter AI</div>
        <button onClick={() => setIsOpen(false)}><X size={18}/></button>
      </div>
      <div className="h-64 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`p-3 rounded-lg text-sm ${m.sender === 'user' ? 'bg-slate-700 ml-8 text-white' : 'bg-slate-900 border border-slate-700 mr-8 text-slate-200'}`}>
            {m.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="p-2 border-t border-slate-700 flex gap-2 bg-slate-900">
        <input className="flex-grow bg-slate-800 rounded px-3 py-2 text-white outline-none text-sm focus:ring-1 focus:ring-yellow-500" value={input} onChange={e=>setInput(e.target.value)} placeholder="Type here..." />
        <button type="submit" className="text-yellow-500 p-1"><Send size={18}/></button>
      </form>
    </div>
  );
};
