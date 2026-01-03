import { ServiceItem, PortfolioItem, BlogPost } from './types';
import { Search, Globe, Users, BarChart, Zap, Target } from 'lucide-react';

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
    description: 'Not just keywords. We build an ecosystem of content that positions your brand as the only logical choice in your area.',
    icon: 'Globe'
  },
  {
    id: 'funnels',
    title: 'Conversion Funnels',
    description: 'We turn "just looking" traffic into paying appointments with automated lead nurturing systems.',
    icon: 'Users'
  }
];

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'plumber-pretoria',
    client: 'Apex Plumbing',
    outcome: '+340% Leads',
    description: 'From 3 calls a week to fully booked. We fixed their GMB profile and automated their review requests.',
    imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'law-firm-sandton',
    client: 'Sandton Legal',
    outcome: 'Ranked #1',
    description: 'Displaced a 10-year incumbent on Google Maps within 90 days using our "Local Authority" protocol.',
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'solar-kzn',
    client: 'Durban Solar',
    outcome: 'R2.5M Revenue',
    description: 'Generated high-ticket solar installs using targeted AI-driven content campaigns.',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800'
  }
];

// --- THIS WAS MISSING ---
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
      { question: 'Does keywords still matter?', answer: 'Yes, but context matters more. You need to answer the questions your customers are asking.' },
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
