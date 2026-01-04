import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I'm Hunter AI. 🤖", sender: 'bot' },
    { id: 2, text: "I can help you audit your digital presence or book a strategy call. What brings you here today?", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // 1. Add User Message
    const userMsg: Message = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");

    // 2. Mock AI Response
    setTimeout(() => {
      let botResponse = "That sounds important. To give you the best advice, I recommend booking a quick 15-min audit with our human experts.";
      
      if (inputText.toLowerCase().includes('price') || inputText.toLowerCase().includes('cost')) {
        botResponse = "We tailor our packages to your business size. Our 'Digital Passport' setup starts at competitive rates. Would you like to see our packages?";
      } else if (inputText.toLowerCase().includes('audit') || inputText.toLowerCase().includes('check')) {
        botResponse = "I can definitely help with an audit! We'll check if you're invisible to Google. Click the 'Book Discovery Call' button to schedule it.";
      }

      const botMsg: Message = { id: Date.now() + 1, text: botResponse, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white w-80 md:w-96 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden mb-4 animate-fade-in-up">
          <div className="bg-gray-900 p-4 flex justify-between items-center border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-400 p-1.5 rounded-lg text-gray-900"><Bot size={20} /></div>
              <div>
                <h3 className="text-white font-bold text-sm">Hunter AI</h3>
                <span className="flex items-center gap-1 text-xs text-green-400 font-medium">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online 24/7
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
          </div>
          <div className="h-80 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-gray-900 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Ask about our services..." className="flex-grow bg-gray-100 text-gray-900 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            <button type="submit" className="bg-yellow-400 text-gray-900 p-2 rounded-xl hover:bg-yellow-300 transition-colors"><Send size={18} /></button>
          </form>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="group flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-105">
        <span className="hidden group-hover:block font-bold text-sm pr-2">Chat with AI</span>
        <div className="relative">
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
          {!isOpen && (<span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span></span>)}
        </div>
      </button>
    </div>
  );
};
