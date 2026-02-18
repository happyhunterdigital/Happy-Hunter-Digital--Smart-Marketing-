import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Zap, Bot } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_CONTEXT = `You are Hunter AI, the intelligent assistant for Happy Hunter Digital — a South African digital marketing agency specializing in Digital Entity Management, Local SEO, Google Business Profile optimization, and AI-powered business audits. 

Your personality: Professional, direct, strategic, and confident. You speak like a trusted advisor, not a salesperson.

Your purpose:
1. Answer questions about Happy Hunter Digital's services
2. Help visitors understand their digital visibility problem
3. Qualify leads and guide them toward booking a consultation or running the free AI audit
4. Never discuss competitors by name

Services offered:
- AI Business Audits (free diagnostic tool on the site)
- Google Business Profile (GMB) Optimization
- Local SEO & Citation Building
- Reputation Management
- Web Development (React/Firebase)
- Digital Entity Management Strategy

Always end responses with a clear next step or call to action when appropriate.`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [handshakeDone, setHandshakeDone] = useState(false);
  const [handshakeFailed, setHandshakeFailed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    if (isOpen && !handshakeDone && !handshakeFailed) {
      performHandshake();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const performHandshake = async () => {
    if (!apiKey) {
      console.error('Gemini API key not found in environment variables.');
      setHandshakeFailed(true);
      setMessages([{
        role: 'assistant',
        content: 'Signal established. How can Smart Marketing transform your entity today?'
      }]);
      setHandshakeDone(true);
      return;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: 'Respond with exactly this greeting and nothing else: "Signal established. How can Smart Marketing transform your entity today?"' }]
            }],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 100,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                   'Signal established. How can Smart Marketing transform your entity today?';

      setMessages([{ role: 'assistant', content: text.trim() }]);
      setHandshakeDone(true);
      setHandshakeFailed(false);
    } catch (error) {
      console.error('Handshake error:', error);
      // Graceful fallback — chatbot still works with a static greeting
      setMessages([{
        role: 'assistant',
        content: 'Signal established. How can Smart Marketing transform your entity today?'
      }]);
      setHandshakeDone(true);
      setHandshakeFailed(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    if (!apiKey) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'I\'m currently offline. Please email us at info@happyhunterdigital.com or use the Analyze Business tool above.'
      }]);
      setIsLoading(false);
      return;
    }

    try {
      // Build conversation history for Gemini
      const conversationHistory = newMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: SYSTEM_CONTEXT }]
            },
            contents: conversationHistory,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
              topP: 0.9,
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || `Status ${response.status}`);
      }

      const data = await response.json();
      const assistantReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                             'I apologize, I couldn\'t process that. Please try again or contact us directly.';

      setMessages([...newMessages, { role: 'assistant', content: assistantReply.trim() }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'I\'m having trouble connecting right now. Please use the Analyze Business tool or reach out via WhatsApp for immediate assistance.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#F5C518] text-black font-bold px-4 py-3 rounded-full shadow-2xl hover:bg-yellow-400 transition-all duration-300 hover:scale-105"
          aria-label="Open Hunter AI Chat"
        >
          <Bot size={20} />
          <span className="text-sm">HUNTER AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[350px] max-w-[95vw] flex flex-col bg-[#0A0A0A] border border-[#F5C518]/30 rounded-2xl shadow-2xl overflow-hidden"
             style={{ height: '500px' }}>
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-[#F5C518]">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-black" />
              <div>
                <p className="font-black text-black text-sm tracking-wider">HUNTER AI</p>
                <p className="text-black/70 text-xs font-medium">SMART MARKETING</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-black hover:opacity-70 transition-opacity">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#F5C518] text-black font-medium rounded-br-sm'
                    : 'bg-[#1A1A1A] text-gray-200 border border-white/10 rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#F5C518] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-[#F5C518] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-[#F5C518] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Query the entity..."
                disabled={isLoading}
                className="flex-1 bg-[#1A1A1A] border border-white/20 rounded-xl px-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#F5C518]/60 disabled:opacity-50 transition-colors"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-[#F5C518] text-black p-2 rounded-xl hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
