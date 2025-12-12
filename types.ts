
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface PortfolioItem {
  id: string;
  client: string;
  outcome: string;
  description: string;
  imageUrl: string;
}

export interface AuditPillar {
  name: string;
  score: number; // 0-100
  status: 'Critical' | 'Warning' | 'Good' | 'Excellent';
  observation: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AuditResult {
  businessName: string;
  location: string;
  overallScore: number;
  pillars: AuditPillar[];
  winStrategy: string;
  competitorGap: string;
  sources: GroundingSource[];
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string; // HTML/Markdown string
  qa: { question: string; answer: string }[];
}

export type ViewState = 'HOME' | 'EARNED_MEDIA' | 'BLOG_READER' | 'PRIVACY_POLICY';
