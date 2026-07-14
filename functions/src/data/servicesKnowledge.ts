// functions/src/data/servicesKnowledge.ts
//
// Single source of truth for what the chatbots (hunterChat + WhatsApp bot) know
// about Happy Hunter Digital's services and pricing.
//
// IMPORTANT: This is a mirror of src/data/servicesData.ts (the frontend data
// that actually renders the Services pages). The `functions/` project has its
// own tsconfig with `include: ["src"]`, so it cannot import directly from the
// frontend's `src/` directory. Whenever servicesData.ts changes (new tiers,
// new prices, new add-ons), update the strings below to match, or the bots
// will quote stale prices to customers.

export const COMPANY_INFO = `
- Company: Happy Hunter Digital (happyhunterdigital.com), a South African digital marketing agency based in Pretoria.
- Founder & Head Strategist: Thabo Motsumi.
- Mission: We stop South African SMEs from being "Ghosts" to AI algorithms. We turn physical businesses into digital powerhouses via Generative/Answer Engine Optimization (GEO/AEO).
- Free diagnostic tool: The "Smart Marketing Scan" (gives a Digital Survival Score). Send users to happyhunterdigital.com/audit.
- Contact: WhatsApp +27 60 101 6673 or email motsumitl@happyhunterdigital.com.
`.trim();

export const MASTER_RETAINERS = `
2026 MASTER RETAINERS (all-in-one monthly packages, starting prices):
- Tier 1 - Essential: R9,950/mo+. For businesses under R5M revenue. Includes: 3-5 page SSR website, Google Business Profile optimization, 2x SEO blog articles/mo, basic WhatsApp API setup, basic email sequence (up to 5k contacts).
- Tier 2 - Comprehensive (most popular): R19,950/mo+. For businesses R5M-R50M revenue. Includes: 5-10 page SSR website + JSON-LD schema, advanced AEO/GEO citation work, 4x SEO articles + 1 whitepaper/mo, 3 automated WhatsApp flows, AI live chat widget.
- Tier 3 - Premium: R39,950/mo+. For businesses R50M+ revenue. Includes: 10-20 page deep build, cross-platform AI citation dominance, 8x articles + 2 whitepapers/mo, AI NLP WhatsApp bot, AI voice agents.
`.trim();

export const SERVICE_CATEGORIES = `
INDIVIDUAL SERVICE CATEGORIES (each has Essential / Comprehensive / Premium tiers, starting prices):
1. AI-Ready Websites - Essential R3,950-R6,500 (1-3 pages) | Comprehensive R12,500-R18,500 (5-10 pages + blog, most popular) | Premium R35,000-R55,000+ (unlimited pages, omnichannel AI sync).
2. 24/7 Digital Receptionists (AI chatbots) - Starter from R450 (basic FAQ web chat) | Business from R1,800 (AI sales chatbot + lead qualification, most popular) | Enterprise R15,000+ (Web + WhatsApp + Social + phone receptionist).
3. Automated WhatsApp Sales - Essential from R4,500 (official API setup) | Comprehensive from R12,500 (interactive catalogs, most popular) | Premium R35,000+ (in-chat payments).
4. Expert Authority Content - Essential from R1.50/word (SEO articles) | Comprehensive from R4,500 (automated email marketing, most popular) | Premium R12,500+ (strategic whitepapers).
5. Direct Booking Engines - Essential from R950 (booking integration) | Comprehensive from R1,500+ (multi-platform channel manager, most popular) | Premium R12,980+ (dynamic AI pricing).
`.trim();

export const STANDALONE_ADDONS = `
STANDALONE ADD-ONS (once-off unless noted /mo):
- Additional Pages: from R750/page
- E-commerce Add-on: from R4,500
- Booking System: from R2,500
- SEO Blogs: from R1.50/word
- Technical Writing: from R3.00/word
- Whitepapers & Strategy: from R5,500
- Custom GPT / AI Agent: from R9,950
- AI Visibility Audit: from R3,950
- GBP Setup & Verification: from R2,950
- Entity Architecture Starter: from R9,950
- WhatsApp API Setup: from R7,950
- Interactive Lead Magnet: from R9,950
- GBP Optimization Starter: from R1,950/mo
- GBP Optimization Pro: from R3,950/mo
- AEO/GEO Starter: from R5,950/mo
- WhatsApp Commerce Pro: from R5,950/mo
- AI Voice Agent: from R9,950/mo
- Dynamic Pricing AI: from R14,950/mo
`.trim();

/** Full knowledge base, for prompts that can afford more length (e.g. website chat). */
export const FULL_KNOWLEDGE_BASE = `
${COMPANY_INFO}

${MASTER_RETAINERS}

${SERVICE_CATEGORIES}

${STANDALONE_ADDONS}
`.trim();
