import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles } from 'lucide-react';
// FIX: Use one dot (.) to go up one level, not two
import { getGenerativeModel } from '../firebaseShim'; 

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

  // 1. GREETING
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Welcome — we help local businesses get noticed and trusted on Google. Need a quick audit? 🚀", sender: 'bot' }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      // Connect to Real AI
      const model = getGenerativeModel();
      const chat = model.startChat();
      const result = await chat.sendMessage(userMsg.text);
      const response = result.response.text();

      const botMsg: Message = { id: Date.now() + 1, text: response, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat Error", error);
      const fallbackMsg: Message = { 
        id: Date.now() + 1, 
        text: "Please click the green WhatsApp button to chat with our experts directly!", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white w-80 md:w-96 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden mb-4 flex flex-col max-h-[500px]">
          <div className="bg-gray-900 p-4 flex justify-between items-center border-b border-gray-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-400 p-1.5 rounded-lg text-gray-900 shadow-lg"><Bot size={20} /></div>
              <div>
                <h3 className="text-white font-bold text-sm">Hunter AI</h3>
                {/* BRANDING */}
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-blue-400 font-medium">
                    <Sparkles size={10} />
                    Powered by Smart Marketing
                  </span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-gray-900 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}`}>
                   {msg.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-gray-400 text-xs ml-4">Hunter AI is thinking...</div>}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2 shrink-0">
            <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Ask about our services..." className="flex-grow bg-gray-100 text-gray-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            <button type="submit" className="bg-yellow-400 text-gray-900 p-3 rounded-xl hover:bg-yellow-300 transition-colors shadow-md"><Send size={18} /></button>
          </form>
        </div>
      )}
      {!isOpen && (
      <button onClick={() => setIsOpen(true)} className="group flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-105 border border-gray-700/50">
        <span className="hidden group-hover:block font-bold text-sm pl-1">Ask Hunter AI</span>
        <div className="relative"><Sparkles size={24} className="text-yellow-400" /></div>
      </button>
      )}
    </div>
  );
};
