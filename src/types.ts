// src/types.ts
import { ReactNode } from 'react';

// Defines the message structure used in Chatbot.tsx
export interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
}

// Defines the structure of the AI Chat Session used in Chatbot.tsx
export interface GenerativeChat {
  sendMessage(message: string): Promise<{ response: { text: () => string } }>;
}

// Interface for Blog Posts
export interface BlogPost {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string | ReactNode; 
  qa?: { question: string; answer: string }[];
  date?: string;
  readTime?: string;
}
