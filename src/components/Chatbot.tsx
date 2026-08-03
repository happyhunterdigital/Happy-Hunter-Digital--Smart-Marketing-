import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';
import { functions } from '../firebaseConfig';
import { httpsCallable } from 'firebase/functions';
import { sanitizeHTML } from '../utils/sanitize';
import { moderateContent } from '../utils/moderate';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

export const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: '<p>Protocol initialized. I am the <strong>Smart Marketing AI</strong>.</p><p>How can I help you dominate the AI search era?</p>' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    if (userMsg.length > 500) {
      setMessages(prev => [...prev, { role: 'bot', text: '<p>Message too long. Please keep it under 500 characters.</p>' }]);
      setLoading(false);
      return;
    }
    if (!moderateContent(userMsg).clean) {
      setMessages(prev => [...prev, { role: 'bot', text: '<p>I cannot respond to that. Please keep our conversation professional.</p>' }]);
      setLoading(false);
      return;
    }
    setInput('');
    const currentHistory = [...messages];

    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const hunterChatCall = httpsCallable(functions, 'hunterChat');
      const response = await hunterChatCall({
        message: userMsg,
        history: currentHistory
      }) as any;

      const replyText = response.data?.reply || "<p>I received no response from the database.</p>";
      setMessages(prev => [...prev, { role: 'bot', text: replyText }]);
    } catch (err: any) {
      console.error("Frontend Chat Error:", err);
      setMessages(prev => [...prev, { role: 'bot', text: "<p>Signal interference. Please retry.</p>" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[150] bg-yellow-500 text-black p-0 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:scale-110 transition-transform w-14 h-14 overflow-hidden"
      >
        {open ? (
          <X size={24} className="m-4" />
        ) : (
          <img
            src="https://res.cloudinary.com/dkyg07qvv/image/upload/v1785770376/Happyhunterdigital_smart_marketing_chatbot_xnvd5c.jpg"
            alt="Open chatbot"
            className="w-10 h-10 object-contain m-2"
          />
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-[150] w-[calc(100vw-3rem)] sm:w-80 md:w-96 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[600px] animate-fade-in">
          <div className="bg-black p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="text-yellow-500" size={20} />
              <span className="font-bold text-white text-sm uppercase tracking-wider">SMART MARKETING AI</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto h-80 space-y-4 bg-black/50 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] min-w-0 p-3 rounded-xl text-sm leading-relaxed space-y-2 [&_a]:underline [&_a]:font-bold transition-all ${
                    m.role === 'user' 
                      ? 'bg-yellow-500 text-black font-medium [&_a]:text-black' 
                      : 'bg-gray-800 text-gray-200 [&_a]:text-yellow-500 hover:[&_a]:text-white'
                  }`}
                  style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(m.text) }}
                />
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-500 text-xs p-3 rounded-xl flex items-center gap-2">
                  <Loader2 className="animate-spin" size={14} /> Computing response...
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          <form onSubmit={sendMessage} className="p-3 bg-gray-900 border-t border-gray-800 flex gap-2 items-center">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter command..."
              className="flex-1 bg-black text-white text-sm p-3 rounded-lg border border-gray-800 focus:border-yellow-500 outline-none disabled:opacity-50 min-w-0"
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="text-yellow-500 hover:text-white p-3 disabled:opacity-50 transition-colors shrink-0"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
