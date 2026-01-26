// src/types.ts
import { ReactNode } from 'react';
import { User } from 'firebase/auth'; // Import for AdminDashboard user type

// --- GENERAL UI TYPES ---
export interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
}

export interface GenerativeChat {
  sendMessage(message: string): Promise<{ response: { text: () => string } }>;
}

// --- LEAD & AUDIT TYPES ---
// Structure for the lead data stored in Firestore
export interface Lead {
  id: string;
  businessName: string;
  location: string;
  website?: string;
  email: string;
  status: 'new' | 'contacted';
  auditScore: number;
  date: Date | { seconds: number, nanoseconds: number }; // Handle Firestore timestamp
}

// Structure for the data returned by performAudit (geminiService.ts)
export interface AuditResult {
  score: number;
  summary: string;
  problems: { title: string; desc: string; severity: 'high' | 'medium' }[];
  solutions: { title: string; desc: string }[];
}

// Type alias for Firebase User state
export type UserState = User | null;
