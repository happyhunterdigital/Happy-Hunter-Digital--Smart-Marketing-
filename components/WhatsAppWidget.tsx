import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, Trash2 } from 'lucide-react';

// --- KNOWLEDGE BASE (THE BRAIN) ---
const KNOWLEDGE_BASE = [
  {
    keywords: ['price', 'cost', 'expensive', 'rates', 'quote', 'money'],
    answer: "We tailor our pricing to your business size. Our 'Digital Passport' setup starts at competitive rates. Would you like to book a 15-min quote call?"
  },
  {
    keywords: ['audit', 'check', 'invisible', 'ghost', 'ranking', 'google'],
    answer: "We call that the 'Ghost Effect'—when you exist but Google ignores you. I can arrange a free Digital Passport Audit. Shall I send you the booking link?"
  },
  {
    keywords: ['services', 'offer', 'what do you do', 'help'],
    answer: "We offer 3 Core Pillars: 1) The Trust Anchor (GMB Optimization), 2) The AI Megaphone (Entity Citations), and 3) The Conversion Brain (AI Receptionists)."
  },
  {
    keywords: ['hello', 'hi', 'hey', 'start'],
    answer: "Hello! 👋 I remember you. I'm still here if you have questions about our 2026 Strategy."
  }
];

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- MEMORY SYSTEM (LOCAL STORAGE) ---
  // 1. Load conversation from memory on startup
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('hunter_chat_history');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "Hello! I'm Hunter AI. 🤖", sender: 'bot' },
      { id: 2, text: "I know everything on this website. Ask me about pricing, services, or the 'Ghost Effect'.", sender: 'bot' }
    ];
  });

  // 2. Save conversation to memory whenever it changes
  useEffect(() => {
    localStorage.setItem('hunter_chat_history', JSON.stringify(messages));
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const clearMemory = () => {
    localStorage.removeItem('hunter_chat_history');
    setMessages([
      { id: Date.now(), text: "Memory cleared. Starting fresh! How can I help?", sender: 'bot' }
    ]);
  };

  const findAnswer = (input: string) => {
    const lowerInput = input.toLowerCase();
    const match = KNOWLEDGE_BASE.find(item => item.keywords.some(keyword => lowerInput.includes(keyword)));
    
    if (match) return match.answer;
    return "That's a great specific question. To be honest, a human expert would answer that best. Want me to open the calendar for a quick 15-min chat?";
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // User Message
    const userMsg: Message = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // AI Response
    setTimeout(() => {
      const answer = findAnswer(userMsg.text);
      const botMsg: Message = { id: Date.now() + 1, text: answer, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="bg-white w-80 md:w-96 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden mb-4 animate-fade-in-up flex flex-col max-h-[500px]">
          
          {/* Header */}
          <div className="bg-gray-900 p-4 flex justify-between items-center border-b border-gray-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-400 p-1.5 rounded-lg text-gray-900 shadow-lg">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Hunter AI</h3>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-green-400 font-medium">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    Memory Active
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={clearMemory} className="text-gray-500 hover:text-red-400 transition-colors" title="Clear Memory">
                <Trash2 size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-gray-900 text-white rounded-br-none' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {/* Linkify Logic */}
                  {msg.text.split(' ').map((word, i) => 
                    word.startsWith('http') ? 
                    <a key={i} href={word} target="_blank" rel="noreferrer" className="underline text-yellow-500 hover:text-yellow-600 font-bold break-all">{word} </a> : 
                    word + ' '
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Animation */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2 shrink-0">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-grow bg-gray-100 text-gray-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-shadow"
            />
            <button 
              type="submit" 
              className="bg-yellow-400 text-gray-900 p-3 rounded-xl hover:bg-yellow-300 transition-colors shadow-md shadow-yellow-400/20"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* FLOATING TOGGLE BUTTON */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 border border-gray-700/50"
      >
        <span className="hidden group-hover:block font-bold text-sm pl-1">Ask Hunter AI</span>
        <div className="relative">
          {isOpen ? <X size={24} /> : <Sparkles size={24} className="text-yellow-400" />}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
            </span>
          )}
        </div>
      </button>
    </div>
  );
};
