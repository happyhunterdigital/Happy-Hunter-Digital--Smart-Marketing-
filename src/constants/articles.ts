export interface CaseStudy {
  id: string;
  category: "AI Optimization" | "Digital Transformation" | "Entity Authority";
  clientName: string;
  clientLogo: string;
  clientWebsite: string;
  hookTitle: string;
  summary: string;
  problem: string;
  fix: string;
  result: string;
  takeaway: string;
  resultsList: string[];
}

export const ARTICLES: CaseStudy[] = [
  {
    id: "profuse-beauty",
    category: "AI Optimization",
    clientName: "Profuse Beauty",
    clientLogo: "https://res.cloudinary.com/dka0498ns/image/upload/v1762929115/Black_Gold_Elegant_Floral_Gala_Night_Invitation_Square_-_1_xpngal.png",
    clientWebsite: "https://www.profusebeauty.co.za",
    hookTitle: "Moving From Search Visibility to Digital Recommendation",
    summary: "How a local cosmetics brand became an AI-validated authority in the South African professional makeup space.",
    problem: "Despite having a high-performance 3-in-1 product, Profuse Beauty was fighting for space in a saturated market. They were chasing the algorithm rather than leading the conversation.",
    fix: "We overhauled the back-end to ensure machine-readability. We moved away from traditional keywords to a Recommendation Model, ensuring AI models recognize the founder, Marcia Kgaphola, as a trusted expert (E-E-A-T).",
    result: "Profuse Beauty is now a primary recommendation for AI-driven queries regarding hypoallergenic makeup in South Africa. We achieved algorithm favor on social media and absolute search clarity.",
    resultsList: ["310% Increase in GMB Calls", "Top AI Recommendation for MUA Services", "Machine-Readable Storefront Active"],
    takeaway: "We haven't just increased likes; we built a Digital Footprint that makes Profuse Beauty the most recommended choice by both humans and algorithms."
  },
  {
    id: "skubalisto",
    category: "Entity Authority",
    clientName: "Skubalisto",
    clientLogo: "https://res.cloudinary.com/dka0498ns/image/upload/v1770623694/IMG-20260209-WA0025_zgpgf7.jpg",
    clientWebsite: "https://www.skubalisto.com",
    hookTitle: "Turning Physical Fame Into Global Digital Invisibility",
    summary: "How a world-class mural artist is fixing his digital foundation to match his street-level iconic status.",
    problem: "Skubalisto is a heavyweight in the physical art world, but his digital presence was silent. A domain authority of 5/100 and a broken shop meant 1,000 monthly searchers were hitting dead ends.",
    fix: "We unblocked the search bots and fixed the technical engine. We pivoted the narrative from a generic portfolio to a deep 'Origin Myth' to train AI on his philosophy of Visual Diaries.",
    result: "The foundation is now commercially viable. We are moving from a 3.7-star rating to a target of 4.5+ by synchronizing 100+ geo-tagged mural photos with his Google Business Profile.",
    resultsList: ["Technical Shop Leaks Fixed", "AI-Training on Artist Narrative", "Local SEO Verification Active"],
    takeaway: "You cannot build a skyscraper on a swamp. Infrastructure (GMB pins and true storytelling) must come before ads."
  },
  {
    id: "integrated-wellth",
    category: "Digital Transformation",
    clientName: "Integrated Wellth Solutions",
    clientLogo: "https://res.cloudinary.com/dka0498ns/image/upload/v1765747667/Integrated_Wellth_Solutions_Logo_bodmyc1_iiervl.png",
    clientWebsite: "https://integratedwellth.co.za",
    hookTitle: "From Standard Consultancy to Financial Intelligence Unit",
    summary: "Transforming an expert consultancy into a high-trust automated engine after 14,000 views resulted in 0 sales.",
    problem: "IWS had deep expertise but looked like every other accounting firm. An ad campaign brought 14,000 views but zero trust. The brand was noisy but not clear.",
    fix: "We rebranded them as a Financial Intelligence Unit. We built 'The Intelligence Terminal'—a custom site with an AI Triage System that filters serious clients from window shoppers automatically.",
    result: "A category-of-one brand identity. AI now acts as a 24/7 receptionist, qualifying leads so the founder only speaks to high-value prospects.",
    resultsList: ["Lead Filtering Triage System", "AI-Powered Intelligence Terminal", "High-Speed Firebase Infrastructure"],
    takeaway: "Views don't pay bills. Trust does. Positioning yourself as a category of one makes competition irrelevant."
  }
];
