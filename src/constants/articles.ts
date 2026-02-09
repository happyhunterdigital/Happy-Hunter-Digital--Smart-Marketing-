export interface CaseStudy {
  id: string;
  category: "AI-Powered Marketing" | "Digital Transformation" | "Entity Authority";
  clientName: string;
  clientLogo: string;
  clientWebsite: string;
  hookTitle: string;
  summary: string;
  problem: string;
  fix: string;
  result: string;
  resultsList: string[];
}

export const ARTICLES: CaseStudy[] = [
  {
    id: "profuse-beauty-success",
    category: "AI-Powered Marketing",
    clientName: "Profuse Beauty",
    clientLogo: "https://res.cloudinary.com/dka0498ns/image/upload/v1762929115/Black_Gold_Elegant_Floral_Gala_Night_Invitation_Square_-_1_xpngal.png",
    clientWebsite: "https://www.profusebeauty.co.za",
    hookTitle: "Moving From Search Visibility to Digital Recommendation",
    summary: "How we pivoted a local makeup brand from 'traditional SEO' to becoming the primary AI recommendation for sensitive skin MUAs in Pretoria.",
    problem: "Fighting for space in a saturated market, chasing the algorithm rather than leading the conversation.",
    fix: "We overhauled the back-end for 'machine readability'. We moved from keywords to a Recommendation Model, ensuring AI models recognize founder Marcia Kgaphola as a verified authority (E-E-A-T).",
    result: "Achieved local authority for 'Sensitive Skin Foundations' in Gauteng. The brand is now a citable source for AI-driven makeup queries.",
    resultsList: ["310% Increase in GMB Calls", "Algorithm Favor on Reels/Stories", "Machine-Readable Storefront Active"]
  },
  {
    id: "khongoloti-academy-growth",
    category: "Digital Transformation",
    clientName: "Khongoloti Training Academy",
    clientLogo: "https://images.unsplash.com/photo-1544640808-32ca72ac7f67?q=80&w=200&auto=format&fit=crop", // Placeholder for Education Authority
    clientWebsite: "https://khongoloti.co.za",
    hookTitle: "Modernizing SETA-Accredited Visibility in the AI Era",
    summary: "Bridging the gap between high-tier classroom quality and digital search invisibility for a Limpopo powerhouse.",
    problem: "Fragmented messaging for diverse auditing and farming research services. Students faced high-friction manual journeys from inquiry to certification.",
    fix: "We implemented an AEO-First approach. We restructured the 'Khongoloti Trading and Enterprise' profile to build Entity Authority. We created a 'Business Success Loop' by integrating their services with The Tax Shop Giyani.",
    result: "Dominant visibility for 'SETA Training Giyani'. Automated the inbound pipeline, aligning the student journey with the digital search bar.",
    resultsList: ["Automated Inbound Pipeline", "Integrated Enterprise Profile", "AEO FAQ Schema Active"]
  },
  {
    id: "skubalisto-visibility",
    category: "Entity Authority",
    clientName: "Skubalisto",
    clientLogo: "https://res.cloudinary.com/dka0498ns/image/upload/v1770623694/IMG-20260209-WA0025_zgpgf7.jpg",
    clientWebsite: "https://www.skubalisto.com",
    hookTitle: "Turning Physical Fame Into Global Digital Invisibility",
    summary: "How a world-class mural artist fixed his 'Ghost Website' and unblocked Google to match his physical street-level iconic status.",
    problem: "Famous on the streets but invisible online. Skubalisto's website had a domain authority of 5/100 and technical blocks prevented Google from reading his 'Origin Myth'.",
    fix: "We performed an emergency repair: fixed broken shop links, unblocked the search bots, and re-aligned his digital entity with his physical murals in Langa and Woodstock.",
    result: "Transformed a static portfolio into a commercially viable engine. We are moving his rating to a target of 4.5+ through 100+ geo-tagged authoritative signal updates.",
    resultsList: ["Technical Shop Leaks Fixed", "AI Training on Artist Narrative", "Local SEO Verification Active"]
  },
  {
    id: "integrated-wellth-terminal",
    category: "Digital Transformation",
    clientName: "Integrated Wellth Solutions",
    clientLogo: "https://res.cloudinary.com/dka0498ns/image/upload/v1765747667/Integrated_Wellth_Solutions_Logo_bodmyc1_iiervl.png",
    clientWebsite: "https://integratedwellth.co.za",
    hookTitle: "From Standard Consultancy to Financial Intelligence Unit",
    summary: "Fixing a 'High Traffic, Low Trust' problem after 14,000 views resulted in 0 sales for a Pretoria-based expert.",
    problem: "14,000 people looked, but zero people felt safe enough to buy because the brand looked like a generic accounting firm.",
    fix: "We rebranded them as a 'Financial Intelligence Unit'. We built 'The Intelligence Terminal'—a platform that uses AI to filter leads and prove authority before the first call.",
    result: "Created a category-of-one identity. AI now acts as a 24/7 receptionist, qualifying leads so the founder only speaks to pre-convinced, high-value prospects.",
    resultsList: ["Lead Filtering Triage System", "AI-Powered Intelligence Terminal", "High-Speed Firebase Infrastructure"]
  }
];
