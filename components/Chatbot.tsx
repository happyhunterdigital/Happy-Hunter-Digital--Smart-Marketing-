import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, Loader2 } from 'lucide-react';
import { model } from '../firebaseConfig'; // Import the Real Gemini Brain

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
  // Load conversation from memory on startup so history isn't lost on refresh
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('hunter_chat_history');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "Hello! I'm Hunter AI. 🤖", sender: 'bot' },
      { id: 2, text: "I'm powered by Gemini via Firebase. I can analyze your business needs in real-time. Ask me about the 'Ghost Effect' or our pricing!", sender: 'bot' }
    ];
  });

  // Save conversation to memory whenever it changes
  useEffect(() => {
    localStorage.setItem('hunter_chat_history', JSON.stringify(messages));
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // 1. Add User Message
    const userMsg: Message = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      // 2. Call Gemini (The Real Brain)
      // We send the chat history so it understands context
      const chat = model.startChat({
        history: messages.map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        })),
      });

      const result = await chat.sendMessage(userMsg.text);
      const response = result.response.text();

      // 3. Add Gemini Response
      const botMsg: Message = { id: Date.now() + 1, text: response, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Gemini Error:", error);
      const errorMsg: Message = { id: Date.now() + 1, text: "My brain is momentarily disconnected (Network Error). Please try again in a moment.", sender: 'bot' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
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
                  <span className="flex items-center gap-1 text-xs text-blue-400 font-medium">
                    <Sparkles size={10} />
                    Powered by Gemini
                  </span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
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
                   {/* Auto-linkify URLs in text (e.g., the Calendly link) */}
                   {msg.text.split(' ').map((word, i) => 
                    word.startsWith('http') ? 
                    <a key={i} href={word} target="_blank" rel="noreferrer" className="underline text-yellow-500 hover:text-yellow-600 font-bold break-all">{word} </a> : 
                    word + ' '
                  )}
                </div>
              </div>
            ))}
            
            {/* Thinking Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-2 items-center text-gray-500 text-xs font-medium">
                  <Loader2 size={14} className="animate-spin" />
                  Thinking...
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
              placeholder="Ask anything..."
              disabled={isTyping}
              className="flex-grow bg-gray-100 text-gray-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
            />
            <button 
              type="submit" 
              disabled={isTyping}
              className="bg-yellow-400 text-gray-900 p-3 rounded-xl hover:bg-yellow-300 transition-colors shadow-md shadow-yellow-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 border border-gray-700/50"
      >
        <span className="hidden group-hover:block font-bold text-sm pl-1">Ask Hunter AI</span>
        <div className="relative">
          {isOpen ? <X size={24} /> : <Sparkles size={24} className="text-yellow-400" />}
        </div>
      </button>
    </div>
  );
};
