import React, { useState } from 'react';
import { MessageSquare, Send, X, Bot } from 'lucide-react';
import { functions } from '../firebaseConfig';
import { httpsCallable } from 'firebase/functions';

export const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState([{ role: 'bot', text: 'Hunter AI linked. Commands?' }]);
  const [input, setInput] = useState('');

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = input; setInput('');
    setChat(prev => [...prev, { role: 'user', text: msg }]);
    try {
      const hunterChat = httpsCallable(functions, 'hunterChat');
      const result: any = await hunterChat({ message: msg });
      setChat(prev => [...prev, { role: 'bot', text: result.data.reply }]);
    } catch (e) {
      setChat(prev => [...prev, { role: 'bot', text: "Signal lost." }]);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} className="fixed bottom-6 right-6 bg-yellow-500 p-4 rounded-full text-black z-50 shadow-xl">{open ? <X/> : <MessageSquare/>}</button>
      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          <div className="p-4 bg-black border-b border-gray-800 flex gap-2 items-center font-bold text-xs uppercase text-yellow-500"><Bot size={16}/> Hunter AI</div>
          <div className="h-64 overflow-y-auto p-4 space-y-4 bg-black/40">
            {chat.map((c, i) => <div key={i} className={`text-xs p-2 rounded ${c.role === 'user' ? 'bg-yellow-500 text-black ml-8' : 'bg-gray-800 text-white mr-8'}`}>{c.text}</div>)}
          </div>
          <form onSubmit={send} className="p-2 bg-black flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 bg-gray-900 text-white p-2 rounded text-xs outline-none border border-gray-800" placeholder="Command..." />
            <button className="text-yellow-500"><Send size={16}/></button>
          </form>
        </div>
      )}
    </>
  );
};
