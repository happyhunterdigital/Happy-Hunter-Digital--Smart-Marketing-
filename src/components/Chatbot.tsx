import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Loader2, Mic, MicOff } from 'lucide-react';
import { functions } from '../firebaseConfig';
import { httpsCallable } from 'firebase/functions';

// TypeScript definitions for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((this: SpeechRecognition, ev: any) => any) | null;
  onerror: ((this: SpeechRecognition, ev: any) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}
declare var SpeechRecognition: { prototype: SpeechRecognition; new(): SpeechRecognition; };
declare var webkitSpeechRecognition: { prototype: SpeechRecognition; new(): SpeechRecognition; };

export const Chatbot: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([{ role: 'bot', text: 'Protocol initialized. I am your Smart Marketing Chat assistant. How can I help you dominate the AI search era?' }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Sorry, your browser doesn't support voice recognition.");
            return;
        }

        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
            return;
        }

        const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognitionApi();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            setInput(transcript);
        };

        recognitionRef.current.onerror = (event) => {
            console.error("Speech Recognition Error:", event.error);
            setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
            setIsRecording(false);
        };

        recognitionRef.current.start();
        setIsRecording(true);
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        }
        
        const userMsg = input.trim();
        setInput('');
        
        const currentHistory = [...messages', text: replyText }]);
        } catch (err: any) {
            console.error("Frontend Chat Error:", err);
            setMessages(prev => [...prev, { role: 'bot', text: "Signal interference. Please retry." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button onClick={() => setOpen(!open)} className="fixed bottom-6 right-6 z-[150] bg-yellow-500 text-black p-4 rounded-full shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:scale-110 transition-all duration-300">
                {open ? <X size={24} /> : <MessageSquare size={24} />}
            </button>

            {open && (
                <div className="fixed bottom-24 right-6 z-[150] w-[340px] md:w-[400px] bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden max-h-[650px] animate-fade-in">
                    <div className="bg-transparent p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-500/10 rounded-xl">
                                <Bot className="text-yellow-500" size={20} />
                            </div>
                            <span className="font-black text-white text-xs uppercase tracking-widest">Smart Marketing Chat</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                        </div>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto h-96 space-y-6 bg-transparent scrollbar-hide">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 text-sm leading-relaxed shadow-md ${m.role === 'user' ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold rounded-2xl rounded-tr-sm' : 'bg-white/5 border border-white/10 text-gray-300 rounded-2xl rounded-tl-sm'}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border border-white/10 text-gray-400 text-xs p-4 rounded-2xl rounded-tl-sm flex items-center gap-3 shadow-md">
                                    <Loader2 className="animate-spin text-yellow-500" size={14} /> Synthesizing response...
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>

                    <form onSubmit={sendMessage} className="p-5 bg-transparent border-t border-white/5 flex gap-3 items-center">
                        <button type="button" onClick={handleVoiceInput} className={`p-4 rounded-xl transition-colors ${isRecording ? 'bg-red-500/20 text-red-500' : 'bg-black/50 text-gray-400 hover:text-yellow-500'}`}>
                            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                        </button>
                        <input 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            placeholder={isRecording ? "Listening..." : "Type your message..."} 
                            className="flex-1 bg-black/50 text-white text-sm px-5 py-4 rounded-xl border border-white/10 focus:border-yellow-500 outline-none transition-colors shadow-inner" 
                            disabled={loading} 
                        />
                        <button type="submit" disabled={loading || !input.trim()} className="bg-yellow-500 text-black rounded-xl p-4 shadow-lg hover:bg-white disabled:opacity-50 transition-all">
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};
