import React, { useState, useEffect, useRef } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import { motion } from 'framer-motion';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, limitToLast } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Send, Users, Heart, Flame, ThumbsUp } from 'lucide-react';

// ==========================================
// 1. FLOATING REACTION COMPONENT
// ==========================================
const FloatingReaction: React.FC<{ emoji: string; onComplete: () => void }> = ({ emoji, onComplete }) => {
  const randomX = Math.floor(Math.random() * 100) - 50; 

  return (
    <motion.div
      initial={{ opacity: 1, y: 0, x: 0, scale: 0.5 }}
      animate={{ opacity: 0, y: -400, x: randomX, scale: 1.5 }}
      transition={{ duration: 2, ease: "easeOut" }}
      onAnimationComplete={onComplete}
      className="absolute bottom-20 left-1/2 text-4xl pointer-events-none z-50 drop-shadow-2xl"
    >
      {emoji}
    </motion.div>
  );
};

// ==========================================
// 2. MAIN WEBINAR COMPONENT
// ==========================================
export const LiveSummit: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [reactions, setReactions] = useState<any[]>([]);
  const [viewerName, setViewerName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ---> YOUR OFFICIAL MUX PLAYBACK ID <---
  const MUX_PLAYBACK_ID = "h1EYLahxhqMk68pdR8fzODNTadhobMaOa4kvOCVIWkI"; 

  // Real-time Chat Listener
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    return () => unsubscribe();
  }, []);

  // Real-time Reactions Listener
  useEffect(() => {
    const q = query(collection(db, "reactions"), orderBy("createdAt", "desc"), limitToLast(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          setReactions(prev => [...prev, { id: change.doc.id, emoji: data.emoji }]);
        }
      });
    });
    return () => unsubscribe();
  }, []);

  // Transmit Chat Message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !hasJoined) return;
    try {
      await addDoc(collection(db, "messages"), {
        text: input,
        user: viewerName,
        createdAt: serverTimestamp(),
      });
      setInput('');
    } catch (error) {
      console.error("Chat Error:", error);
    }
  };

  // Transmit Floating Reaction
  const sendReaction = async (emoji: string) => {
    try {
      await addDoc(collection(db, "reactions"), {
        emoji,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Reaction Error:", error);
    }
  };

  // Gatekeeper for Chat
  const handleJoinChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (viewerName.trim()) setHasJoined(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-20 pb-10 px-4 md:px-6">
      
      {/* Header */}
      <div className="max-w-[1600px] mx-auto mb-6 flex justify-between items-end border-b border-gray-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest mb-2 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-red-500"></div> Live Broadcast
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">The AI Growth Summit</h1>
        </div>
        <div className="hidden md:flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
          <Users size={16} className="text-yellow-500" /> Live Telemetry Linked
        </div>
      </div>

      {/* Grid Layout: Video (Left) / Chat (Right) */}
      <div className="max-w-[1600px] mx-auto grid lg:grid-cols-[3fr_1fr] gap-6 h-[75vh]">
        
        {/* LEFT: Video & Reactions Section */}
        <section className="relative bg-black border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          <div className="flex-1 relative bg-[#0a0a0a]">
            
            <MuxPlayer
              playbackId={MUX_PLAYBACK_ID}
              streamType="live"
              primaryColor="#eab308"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              autoPlay
              muted={false}
            />

            {reactions.map(r => (
              <FloatingReaction 
                key={r.id} 
                emoji={r.emoji} 
                onComplete={() => setReactions(prev => prev.filter(item => item.id !== r.id))} 
              />
            ))}
          </div>

          <div className="h-16 bg-[#050505] border-t border-gray-800 flex items-center justify-between px-6 z-20">
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Happy Hunter Digital</span>
            <div className="flex gap-4">
              <button onClick={() => sendReaction('❤️')} className="p-2 hover:bg-gray-800 rounded-full transition-colors"><Heart size={20} className="text-red-500" fill="currentColor"/></button>
              <button onClick={() => sendReaction('👏')} className="p-2 hover:bg-gray-800 rounded-full transition-colors"><ThumbsUp size={20} className="text-yellow-500" fill="currentColor"/></button>
              <button onClick={() => sendReaction('🔥')} className="p-2 hover:bg-gray-800 rounded-full transition-colors"><Flame size={20} className="text-orange-500" fill="currentColor"/></button>
            </div>
          </div>
        </section>

        {/* RIGHT: Live Chat Section */}
        <section className="bg-black border border-gray-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl relative">
          <div className="p-4 border-b border-gray-800 bg-[#0a0a0a]">
            <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Network Chat
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-800">
            {messages.length === 0 && (
              <p className="text-gray-600 text-xs font-mono text-center mt-10">System initialized. Awaiting messages...</p>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className="text-sm">
                <span className="font-bold text-yellow-500 mr-2">{msg.user}:</span>
                <span className="text-gray-300 break-words">{msg.text}</span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          
          <div className="p-4 border-t border-gray-800 bg-[#0a0a0a]">
            {!hasJoined ? (
              <form onSubmit={handleJoinChat} className="flex gap-2">
                <input 
                  type="text" 
                  value={viewerName} 
                  onChange={(e) => setViewerName(e.target.value)}
                  placeholder="Enter name to join..." 
                  className="flex-1 bg-[#050505] border border-gray-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-500 text-white"
                  required
                />
                <button type="submit" className="bg-yellow-500 text-black font-black uppercase text-xs px-4 rounded-xl hover:bg-white transition-colors">Join</button>
              </form>
            ) : (
              <form onSubmit={sendMessage} className="relative">
                <input 
                  type="text" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Transmit message..." 
                  className="w-full bg-[#050505] border border-gray-800 rounded-xl pl-4 pr-12 py-3 text-sm outline-none focus:border-yellow-500 text-white"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-500 transition-colors p-2">
                  <Send size={18} />
                </button>
              </form>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};
