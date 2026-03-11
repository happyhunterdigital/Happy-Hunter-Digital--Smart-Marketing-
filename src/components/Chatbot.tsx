import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquare, X, Send, Bot, Loader2, Mic, MicOff, AudioWaveform } from 'lucide-react';
import { functions } from '../firebaseConfig';
import { httpsCallable } from 'firebase/functions';

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
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const recordingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setInput(finalTranscript);
          handleVoiceSubmit(finalTranscript);
        } else if (interimTranscript) {
          setInput(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        if (recordingTimerRef.current) window.clearInterval(recordingTimerRef.current);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        if (recordingTimerRef.current) window.clearInterval(recordingTimerRef.current);
      };
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
      if (recordingTimerRef.current) window.clearInterval(recordingTimerRef.current);
    }
    return () => {
      if (recordingTimerRef.current) window.clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  const handleVoiceSubmit = async (voiceText: string) => {
    if (!voiceText.trim() || loading) return;
    
    const userMsg = voiceText.trim();
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

  const toggleRecording = useCallback(() => {
    if (!recognitionRef.current) {
      alert('Voice input is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        setInput('');
      } catch (err) {
        console.error('Failed to start recording:', err);
      }
    }
  }, [isRecording]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <button 
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[150] bg-yellow-500 text-black p-4 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:scale-110 transition-transform"
      >
        {open ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-[150] w-80 md:w-96 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[600px] animate-fade-in">
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
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {/* 
                   SURGICAL FIX: dangerouslySetInnerHTML allows the <p> and <strong> tags 
                   from the backend prompt to render correctly.
                */}
                <div 
                  className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed space-y-2 ${
                    m.role === 'user' 
                      ? 'bg-yellow-500 text-black font-medium' 
                      : 'bg-gray-800 text-gray-200'
                  }`}
                  dangerouslySetInnerHTML={{ __html: m.text }}
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
            <button 
              type="button"
              onClick={toggleRecording}
              disabled={loading}
              className={`p-3 rounded-lg transition-all duration-200 relative ${
                isRecording 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-gray-800 text-gray-400 hover:text-yellow-500 hover:bg-gray-700'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isRecording ? 'Stop recording' : 'Start voice input'}
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
              {isRecording && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              )}
            </button>

            {isRecording && (
              <div className="flex items-center gap-1 px-2">
                <AudioWaveform size={16} className="text-red-400 animate-pulse" />
                <span className="text-xs text-red-400 font-mono">{formatTime(recordingTime)}</span>
              </div>
            )}

            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isRecording ? "Listening..." : "Enter command..."}
              className="flex-1 bg-black text-white text-sm p-3 rounded-lg border border-gray-800 focus:border-yellow-500 outline-none disabled:opacity-50"
              disabled={loading || isRecording}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim() || isRecording}
              className="text-yellow-500 hover:text-white p-3 disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </form>

          {isRecording && (
            <div className="bg-red-500/10 border-t border-red-500/20 px-3 py-2 text-center">
              <p className="text-xs text-red-400 animate-pulse">
                🎤 Recording... Speak clearly. Click the mic to stop.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};
