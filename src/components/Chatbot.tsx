import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X } from 'lucide-react';
import { callHunterAI } from '../firebaseConfig';

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ id: 1, text: "Welcome! I'm Hunter AI. How can I help your business dominate local search today?", sender: 'bot' }]);
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

    const systemContext = `Identity: Hunter AI (Happy Hunter Digital). 
    Expertise: Digital Entity Management, GMB, AI Visibility. 
    Rule: Short answers (2 sentences). Always suggest booking: https://calendly.com/motsumitl/30min if they want details.
    User Question: ${input}`;

    const aiText = await callHunterAI(systemContext);
    
    setMessages(prev => [...prev, { id: Date.now() + 1, text: aiText, sender: 'bot' }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-80 md:w-96 rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[500px] overflow-hidden">
          <div className="bg-gray-900 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Bot className="text-yellow-500" /> Hunter AI
            </div>
            <X className="text-gray-400 cursor-pointer" onClick={() => setIsOpen(false)} />
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl text-sm max-w-[80%] ${m.sender === 'user' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && <p className="text-[10px] text-gray-400">Hunter AI is thinking...</p>}
            <div ref={endRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 border-t flex gap-2">
            <input 
              className="flex-1 bg-gray-100 p-2 rounded-xl text-sm outline-none"
              placeholder="Ask me anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button className="bg-yellow-500 p-2 rounded-xl"><Send size={18} /></button>
          </form>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-gray-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all border border-gray-700">
          <Sparkles className="text-yellow-500" />
        </button>
      )}
    </div>
  );
};
