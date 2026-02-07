// src/components/Chatbot.tsx
import { useState, useRef, useEffect } from 'react';
import { callHunterAI } from '../firebaseConfig'; 
import { MessageSquare, Send, X, Bot, Sparkles } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      text: "👋 Welcome to Smart Marketing. I'm Hunter AI, powered by Gemini 2.5 Flash.\n\nI can help you with:\n• Digital Entity Audits\n• Local SEO strategy\n• AI Visibility (AEO)\n• Social Media positioning\n\nWhat business challenge are you facing today?" 
    }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [messages]);

  const generateSystemPrompt = (userMessage: string) => {
    return `You are Hunter AI, the strategic assistant for Smart Marketing (smartmarketing.co.za). 
You help South African business owners understand digital marketing, entity SEO, and AI visibility.

CONTEXT:
- Smart Marketing specializes in Entity Trust, Mirror Rule compliance, and Answer Engine Optimization (AEO)
- You are powered by Google's Gemini 2.5 Flash model
- Tone: Professional, direct, South African market expert, slightly provocative but helpful
- Always emphasize the cost of invisibility in the AI era
- If they need a full audit, direct them to the Entity Scan tool

USER QUERY: ${userMessage}

Provide a concise, actionable response. If they ask about pricing or booking, send them to https://calendly.com/motsumitl/30min`;
  };

  async function sendMessage() {
    if (!input.trim() || loading) return;
    
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const systemPrompt = generateSystemPrompt(userText);
      const responseText = await callHunterAI(systemPrompt);
      
      if (responseText.includes("SYSTEM_ERROR") || responseText.includes("CONNECTION_ERROR")) {
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: "⚠️ I'm experiencing technical difficulties. Please try again in a moment, or book a direct consultation:\n\nhttps://calendly.com/motsumitl/30min" 
        }]);
      } else {
        setMessages(prev => [...prev,
