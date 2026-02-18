import React, { useState } from 'react';
import { MessageSquare, Send, X, Bot } from 'lucide-react';

export const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState([{ role: 'bot', text: 'Hunter AI active. State your objective.' }]);
  const [input, setInput] = useState('');

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = input; setInput('');
    setChat(prev => [...prev, { role: 'user', text: msg }]);
    const res = await fetch(`https://us-central1-${import.meta.env.VITE_FIREBASE_PROJECT_ID}.cloudfunctions.net/hunterChat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
    const json = await res.json();
    setChat(prev => [...prev, { role: 'bot', text: json.reply }]);
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} className="fixed bottom-6 right-6 bg-brand-yellow p-4 rounded-full text-brand-dark z-50 shadow-xl">{open ? <X/> : <MessageSquare/>}</button>
      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-brand-dark border border-gray-800 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden">
          <div className="p-4 bg-gray-900 border-b border-gray-800 flex gap-2 items-center font-bold text-xs uppercase text-brand-yellow"><Bot size={16}/> Hunter AI</div>
          <div className="h-64 overflow-y-auto p-4 space-y-4 bg-black/40">
            {chat.map((c, i) => <div key={i} className={`text-xs p-2 rounded ${c.role === 'user' ? 'bg-brand-yellow text-brand-dark ml-8' : 'bg-gray-800 text-white mr-8'}`}>{c.text}</div>)}
          </div>
          <form onSubmit={send} className="p-2 bg-gray-900 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 bg-black text-white p-2 rounded text-xs outline-none" placeholder="Command..." />
            <button className="text-brand-yellow"><Send size={16}/></button>
          </form>
        </div>
      )}
    </>
  );
};
