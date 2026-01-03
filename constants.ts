import { ServiceItem, PortfolioItem, BlogPost } from './types';
import { Search, Globe, Users, BarChart, Zap, Target } from 'lucide-react';

// --- YOUR CORRECT CONTACT DETAILS ---
export const CONTACT_PHONE = "27601016673"; 
export const CONTACT_EMAIL = "motsumitl@happyhunterdigital.com";

export const services: ServiceItem[] = [
  {
    id: 'ai-audit',
    title: 'AI Business Audit',
    description: 'We scan your entire digital footprint using Google\'s latest AI to find exactly where you are losing customers to competitors.',
    icon: 'Search'
  },
  {
    id: 'seo',
    title: 'Smart SEO Systems',
    description: 'We build "Entity Authority." We teach Google WHO you are, not just WHAT you do, so you dominate local search.',
    icon: 'Globe'
  },
  {
    id: 'automation',
    title: 'Automation Ecosystems',
    description: 'We implement workflows (N8N + WhatsApp) to automate repetitive tasks like CRM updates and customer notifications.',
    icon: 'Zap'
  }
];

// --- YOUR REAL CASE STUDIES ---
export const portfolioItems: PortfolioItem[] = [
  {
    id: 'township-construction',
    client: 'Township Construction SME',
    outcome: '+40% Visibility',
    description: 'Optimized Google Business Profile and integrated N8N + WhatsApp lead capture. Doubled inbound inquiries in 3 months.',
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'profuse-beauty',
    client: 'Profuse Beauty',
    outcome: '30% More Bookings',
    description: 'Crafted ambassador bios and optimized Instagram/WhatsApp commerce flows. Converted engagement into confidence-driven bookings.',
    imageUrl: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'yoga-startup',
    client: 'Youth-Owned Retail Startup',
    outcome: '50% Engagement',
    description: 'Developed cultural storytelling content for Kemetic Yoga. Automated social campaigns increased class attendance and brand trust.',
    imageUrl: 'https://images.unsplash.com/photo-1599447421405-0c323d14bc68?auto=format&fit=crop&q=80&w=800'
  }
];

// --- BLOG POSTS (Required for Earned Media Page) ---
export const blogPosts: BlogPost[] = [
  {
    id: 'ai-vs-traditional-seo',
    title: 'Why Traditional SEO is Dead (And What Replaced It)',
    category: 'Strategy',
    summary: 'Google is no longer a search engine; it is an answer engine. If your business is optimizing for keywords instead of entities, you are invisible.',
    content: `
      <p>The old way of ranking on Google was simple: stuff your page with keywords like "Plumber in Pretoria" and wait. That stopped working in 2023.</p>
      <p><strong>Enter Search Generative Experience (SGE).</strong></p>
      <p>Google's AI now understands <em>intent</em>. It doesn't look for matching words; it looks for the best solution. If your digital footprint doesn't prove you are a trusted authority, the AI will simply recommend your competitor.</p>
      <p>At Happy Hunter, we build "Entity Authority." We teach Google <em>who</em> you are, not just <em>what</em> you do.</p>
    `,
    qa: [
      { question: 'Do keywords still matter?', answer: 'Yes, but context matters more. You need to answer the questions your customers are asking.' },
      { question: 'How fast can I see results?', answer: 'With our AI-alignment strategy, we often see movement in the Local Pack within 30-45 days.' }
    ]
  },
  {
    id: 'google-business-profile-secrets',
    title: '3 Hidden Settings in Google Business Profile',
    category: 'Tactical',
    summary: 'Most businesses fill out the basics and forget it. Here are the three settings that actually drive phone calls.',
    content: `
      <p>Your Google Business Profile (GBP) is your new homepage. 60% of your customers will never even click through to your website.</p>
      <p>So how do you win?</p>
      <ol>
        <li><strong>Services vs. Products:</strong> List your services as "Products." Google gives them more visual real estate.</li>
        <li><strong>Q&A Seeding:</strong> Don't wait for questions. Ask and answer your own common FAQs to train the AI.</li>
        <li><strong>Review Attributes:</strong> Ask clients to mention specific services in their reviews (e.g., "Great <em>leak detection</em> service").</li>
      </ol>
    `,
    qa: [
      { question: 'Is GBP free?', answer: 'Yes, it is 100% free. Anyone charging you to "rent" it is scamming you.' },
      { question: 'How often should I post?', answer: 'Once a week is enough to show Google you are active.' }
    ]
  }
];
