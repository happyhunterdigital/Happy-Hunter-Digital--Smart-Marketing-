// src/components/Chatbot.tsx
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles } from 'lucide-react';
import { getChatSession } from '../services/geminiService';
import { Message, GenerativeChat } from '../types'; // <--- NEW IMPORTS

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  // Type state correctly now
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<GenerativeChat | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Welcome — we help local businesses get noticed.", sender: 'bot' }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !chatSessionRef.current) {
        // Initialize the stable chat session
        const session = getChatSession();
        if (session) {
            chatSessionRef.current = session as GenerativeChat;
        }
    }
  }, [isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !chatSessionRef.current) return;
    
    const userMsg: Message = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
        // Use the typed session to call sendMessage
        const result = await chatSessionRef.current.sendMessage(userMsg.text);
        const text = result.response.text();

        setMessages(prev => [...prev, { id: Date.now() + 1, text, sender: 'bot' }]);
    } catch (error) {
        setMessages(prev => [...prev, { id: Date.now() + 1, text: "Connection error.", sender: 'bot' }]);
    } finally {
        setIsTyping(false);
    }
  };

  // --- RENDERING LOGIC (Simplified for brevity, assuming original PDF JSX is used) ---
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end ${isOpen ? 'open' : 'closed'}`}>
      {isOpen && (
        <div className="bg-white w-80 md:w-96 rounded-2xl shadow-2xl flex flex-col max-h-[500px] mb-4">
          <div className="bg-gray-900 p-4 flex justify-between items-center text-white">
            <h3 className="font-bold">Hunter AI</h3>
            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-gray-900 text-white' : 'bg-white border text-gray-800'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-gray-400 text-xs ml-4">Hunter AI is thinking...</div>}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className="p-3 bg-white border-t flex gap-2">
            <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Ask about our services..." className="flex-grow bg-gray-100 p-2 rounded-xl text-sm" />
            <button type="submit" className="bg-yellow-400 p-3 rounded-xl"><Send size={18} /></button>
          </form>
        </div>
      )}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="bg-gray-900 hover:bg-gray-800 text-white p-4 rounded-full shadow-2xl flex items-center gap-3">
          Ask Hunter AI <Sparkles size={24} className="text-yellow-400" />
        </button>
      )}
    </div>
  );
};
