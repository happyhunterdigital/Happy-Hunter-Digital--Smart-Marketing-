import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles } from 'lucide-react';

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
    const question = inputText;
    setInputText("");
    setIsTyping(true);

    try {
      // Use your Gemini API key
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 
                     import.meta.env.VITE_API_KEY || 
                     "AIzaSyCqCYLwHtmlJHVVkDckpr_S1o4QKgFyN-M";

      const systemPrompt = `You are 'Hunter AI', the intelligent digital assistant for Happy Hunter Digital, a South African digital marketing agency.

YOUR IDENTITY:
- Professional, confident, and strategic
- Expert in "Digital Entity Management" and helping businesses get noticed by AI search engines

YOUR KNOWLEDGE BASE:
1. THE PROBLEM: The "Ghost Effect" - Businesses exist but are invisible to AI-powered search
2. OUR SOLUTION: "Digital Entity Management" built on 3 pillars:
   - Pillar 1: The Trust Anchor (Google Business Profile Optimization)
   - Pillar 2: The AI Megaphone (Getting cited by smart search assistants)
   - Pillar 3: The Conversion Brain (24/7 AI-powered customer engagement)
3. PROOF:
   - Case Study: Profuse Beauty (310% call increase)
   - Case Study: Construction Firm (R2.5M contract via Trust Architecture)

YOUR INSTRUCTIONS:
- Keep answers concise (2-3 sentences max unless asked for detail)
- Be friendly but professional
- If asked about pricing or wanting an audit, suggest booking: https://calendly.com/motsumitl/30min
- Focus on helping businesses understand why AI visibility matters

USER QUESTION: ${question}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: systemPrompt }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        console.error("Gemini API Error:", data.error);
        throw new Error(data.error.message);
      }

      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                    "I'm here to help! Ask me about our Digital Entity Management services or book a call: https://calendly.com/motsumitl/30min";

      const botMsg: Message = { id: Date.now() + 1, text: aiText, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);

    } catch (error: any) {
      console.error("Chat Error:", error);
      const fallbackMsg: Message = {
        id: Date.now() + 1,
        text: "I'm having connection issues. Book a free audit call: https://calendly.com/motsumitl/30min or WhatsApp us! 📞",
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
            <input 
              type="text" 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} 
              placeholder="Ask about our services..." 
              className="flex-grow bg-gray-100 text-gray-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400" 
            />
            <button type="submit" className="bg-yellow-400 text-gray-900 p-3 rounded-xl hover:bg-yellow-300 transition-colors shadow-md">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="group flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-105 border border-gray-700/50"
        >
          <span className="hidden group-hover:block font-bold text-sm pl-1">Ask Hunter AI</span>
          <div className="relative"><Sparkles size={24} className="text-yellow-400" /></div>
        </button>
      )}
    </div>
  );
};
