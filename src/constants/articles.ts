export interface Article {
  id: string;
  category: "Case Study" | "Protocol";
  title: string;
  summary: string;
  content: string;
  date: string;
  tag: string;
  results: string[];
}

export const ARTICLES: Article[] = [
  {
    id: "profuse-beauty-local-dominance",
    category: "Case Study",
    title: "Profuse Beauty: The Map Pack Domination",
    summary: "How we took a Centurion-based beauty clinic from 'Page 2 Obscurity' to being fully booked 3 weeks in advance using the Mirror Rule.",
    date: "February 2025",
    tag: "310% CALL INCREASE",
    results: ["#1 Rank in Local Pack", "310% Increase in GMB Calls", "Zero Ad Spend Required"],
    content: `
      [SECTION] THE VULNERABILITY
      Profuse Beauty was a 'Ghost Entity'. Despite having elite-level services, their digital presence was fragmented. Their Google Business Profile was unverified, their data nodes (NAP) didn't match their physical reality, and they were losing 80% of local search intent to inferior competitors.
      
      [SECTION] THE PROTOCOL
      We applied the **MIRROR RULE**. We performed an 'Entity Cleanse', synchronizing every digital citation with their physical location in Centurion. We then injected **INFORMATION GAIN** into their service descriptions—writing for the AI algorithm while maintaining human appeal.
      
      [SECTION] THE OUTCOME
      Within 45 days, the 'Smart Filter' recognized Profuse Beauty as the primary authority in their region. The result was not just clicks, but **INBOUND REVENUE**. They are now the local benchmark for beauty clinic visibility in Gauteng.
    `
  },
  {
    id: "construction-sme-trust-architecture",
    category: "Case Study",
    title: "Construction SME: The R2.5M Trust Anchor",
    summary: "Why a generic website was costing this firm millions, and how Trust Architecture secured a landmark residential contract.",
    date: "January 2025",
    tag: "R2.5M CONTRACT SECURED",
    results: ["High-Ticket Conversion", "Entity Trust Verified", "Authority Signal Established"],
    content: `
      [SECTION] THE PAIN POINT
      In the high-stakes construction industry, a 'Generic Website' is a trust-killer. This SME was bidding on multi-million Rand projects but their digital entity looked like a template. High-value clients were performing 'Shadow Audits' and choosing competitors with more authority signals.
      
      [SECTION] THE STRATEGIC FIX
      We replaced their 'Static Flyer' with a **TRUST ANCHOR**. We structured their project data as verifiable nodes. We implemented a 'Data-Rich' portfolio that proved their technical competence to both human stakeholders and Google's Knowledge Graph.
      
      [SECTION] THE HANDSHAKE
      Within 3 months, they secured a **R2.5 MILLION** residential development contract. The client explicitly mentioned the 'professional depth of the digital presence' as the reason they felt safe signing the deal.
    `
  },
  {
    id: "ai-visibility-aeo-protocol",
    category: "Protocol",
    title: "The AI Visibility Crisis of 2026",
    summary: "Traditional SEO is failing. If your brand isn't 'AEO Ready', you are being filtered out of the conversation entirely.",
    date: "February 2026",
    tag: "STRATEGIC ADVISORY",
    results: ["Future-Proofing", "SGE Optimization", "AI Citability"],
    content: `
      [SECTION] THE SHIFT
      We are moving from the 'Age of Links' to the 'Age of Answers'. Google SGE and Gemini are no longer showing a list of 10 links; they are providing **THE ANSWER**. If your business is not cited in that answer, you don't exist to the user.
      
      [SECTION] THE AEO PROTOCOL
      Answer Engine Optimization (AEO) is about becoming a **CITABLE SOURCE**. We restructure your business data into 'Semantic Clusters' that AI models can ingest and recommend. We solve the 'Findability Crisis' by proving your brand is the most reliable entity in its niche.
      
      [SECTION] THE SURVIVAL REQUIREMENT
      Mend your entity architecture now. Every day you wait is a day the algorithms spend training themselves to recommend your competition.
    `
  }
];
