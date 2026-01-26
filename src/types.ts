import { ReactNode } from 'react';

export interface AuditProblem {
  title: string;
  desc: string;
  severity: 'high' | 'medium';
}

export interface AuditSolution {
  title: string;
  desc: string;
}

export interface AuditResult {
  score: number;
  summary: string;
  problems: AuditProblem[];
  solutions: AuditSolution[];
}

export interface Lead {
  id: string;
  businessName: string;
  location: string;
  website?: string;
  email: string;
  status: 'new' | 'contacted';
  auditScore: number;
  date: any;
}

export interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
}
