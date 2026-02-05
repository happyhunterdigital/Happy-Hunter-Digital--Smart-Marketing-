export interface Article {
  id: string;
  category: "Case Study" | "Strategy";
  title: string;
  summary: string;
  content: string;
  date: string;
  tag: string;
}

export const ARTICLES: Article[] = [
  {
    id: "profuse-beauty-success",
    category: "Case Study",
    title: "Profuse Beauty: Dominating the Local Map Pack",
    summary: "How a beauty clinic in Centurion went from invisible to fully booked using the Mirror Rule protocol.",
    date: "Oct 12, 2025",
    tag: "Local Dominance",
    content: `
      <h3>The Challenge</h3>
      <p>Profuse Beauty had high-quality services but zero digital footprints. When users searched for 'Beauty Clinic Centurion', competitors with lower quality but better data were winning the leads.</p>
      
      <h3>The Protocol</h3>
      <p>We implemented the <strong>Mirror Rule</strong>. We synchronized their physical signage, business hours, and location data with the Google Knowledge Graph. Then, we injected 'Information Gain' into their service descriptions.</p>
      
      <h3>The Results</h3>
      <ul>
        <li>310% increase in inbound calls via GMB.</li>
        <li>Ranked #1 in the Local Map Pack within 45 days.</li>
        <li>Eliminated reliance on paid Facebook ads.</li>
      </ul>
    `
  },
  {
    id: "construction-sme-leads",
    category: "Case Study",
    title: "Construction SME: Landing R2.5M via Trust Architecture",
    summary: "Engineering a digital entity that high-ticket clients trust automatically.",
    date: "Nov 05, 2025",
    tag: "High-Ticket Leads",
    content: `
      <h3>The Challenge</h3>
      <p>In the construction industry, trust is the only currency. This SME was losing high-value contracts because their website looked like a template rather than an Authority Entity.</p>
      
      <h3>The Strategy</h3>
      <p>We built a <strong>Trust Architecture</strong>. Instead of just showing photos, we structured their project history as data nodes that AI search engines could verify. We turned their site into a 'Verified Resource'.</p>
      
      <h3>The Outcome</h3>
      <p>Within three months of launch, they secured a R2.5M residential development contract. The client cited the 'professional depth of information' as the deciding factor.</p>
    `
  },
  {
    id: "mirror-rule-explained",
    category: "Strategy",
    title: "The Mirror Rule: Why AI Search Filters You Out",
    summary: "Understanding the primary validator that Google and Gemini use to verify your business.",
    date: "Jan 20, 2026",
    tag: "Entity Trust",
    content: `
      <p>In 2026, AI models are designed to prevent 'Hallucinations'. When an AI recommends a business, it is putting its reputation on the line.</p>
      
      <h3>The Logic</h3>
      <p>If your digital data says you open at 08:00, but a user review says you were closed at 08:30, the AI sees a 'Signal Mismatch'. This is a violation of the Mirror Rule.</p>
      
      <h3>The Fix</h3>
      <p>Your digital entity must be a perfect mirror of your physical reality. We use automated node synchronization to ensure your 'Signal' is always 100% accurate across the entire web.</p>
    `
  }
];
