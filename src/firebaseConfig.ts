// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQvZ2-w9DrJWQEgy4IarClycARAvMJIAc",
  authDomain: "happyhunterdigital-17480.firebaseapp.com",
  projectId: "happyhunterdigital-17480",
  storageBucket: "happyhunterdigital-17480.firebasestorage.app",
  messagingSenderId: "449102421348",
  appId: "1:449102421348:web:d61e0c209b93bf282fae71",
  measurementId: "G-PS04HKGEXF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// CORRECTED: Space removed from URL
export const callHunterAI = async (prompt: string) => {
  const KEY = "AIzaSyCdmPzVLVk0s7prinSgvxulfBZxLBTsA6U";
  
  // ACTUAL FIX: No space after key=
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 4000 }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API HTTP Error:", response.status, errorData);
      return `SYSTEM_ERROR: ${errorData.error?.message || `HTTP ${response.status}`}`;
    }

    const data = await response.json();
    
    if (data.error) {
      return `SYSTEM_ERROR: ${data.error.message}`;
    }
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return "SYSTEM_ERROR: Empty response structure from AI.";
    }

    return data.candidates[0].content.parts[0].text;
  } catch (err: any) {
    console.error("Fetch Error:", err);
    return `CONNECTION_ERROR: ${err.message}`;
  }
};

// Enhanced audit with specific research simulation
export const performAuditAnalysis = async (businessName: string, location: string) => {
  const researchPrompt = `
You are Hunter AI, lead strategist at Smart Marketing (smartmarketing.co.za).
Conduct an UNSPARING strategic entity audit for "${businessName}" operating in ${location}, South Africa.

SIMULATED RESEARCH CONTEXT:
- South African digital landscape: High mobile usage, WhatsApp Business critical, Google Maps dominance
- Local competitors likely using outdated SEO tactics
- AI search (SGE) rolling out in South Africa 2025-2026
- Typical failures: Inconsistent NAP, missing schema markup, dormant social accounts

REQUIRED AUDIT SECTIONS:

[SECTION] LOCAL SEO & GOOGLE BUSINESS PROFILE AUDIT
[H] Current Visibility State
Analyze typical GMB optimization gaps for ${businessName}:
- **GMB COMPLETENESS SCORE**: Estimate 0-100 based on industry standards
- **CRITICAL GMB FAILURES**: Missing attributes, no Q&A strategy, poor photo cadence
- **LOCAL PACK INVISIBILITY**: Why they don't rank in "near me" searches
- **NAP CHAOS**: Citation inconsistencies across South African directories (Yellosa, Snupit, Brabys)
[FIX] GMB DOMINATION PROTOCOL

[SECTION] SOCIAL MEDIA SIGNAL FAILURE
[H] Platform-Specific Breakdown
- **INSTAGRAM**: Content strategy gaps, hashtag failures, engagement rate issues
- **FACEBOOK**: Page optimization, review response failures, community building absence
- **LINKEDIN**: B2B authority gaps, thought leadership vacuum
- **TIKTOK**: Gen Z market abandonment
- **WHATSAPP BUSINESS**: Critical SA market - likely not optimized for commerce
[FIX] SOCIAL SIGNAL RECOVERY

[SECTION] DIGITAL FOOTPRINT INCONSISTENCIES
[H] Web-Wide Data Integrity
- **DIRECTORY ACCURACY**: Presence and consistency across major SA platforms
- **REVIEW VELOCITY**: Current acquisition rate vs. competitors
- **SCHEMA MARKUP**: Missing structured data preventing rich snippets
- **BACKLINK PROFILE**: Domain authority gaps
[FIX] DATA CONSISTENCY REPAIR

[SECTION] AI VISIBILITY & ANSWER ENGINE OPTIMIZATION (AEO)
[H] The LLM Blindspot
- **CHATGPT CITABILITY**: Can GPT-4 recommend this business? Why not?
- **GOOGLE SGE READINESS**: Content structure for AI overviews
- **ENTITY AUTHORITY**: Missing Knowledge Panel triggers
- **MIRROR RULE COMPLIANCE**: Does their digital entity reflect physical reality?
[FIX] AEO IMPLEMENTATION

[SECTION] STRATEGIC VERDICT
[H] The Hard Truth
- **VISIBILITY SCORE**: 0-100 with detailed justification
- **ESTIMATED MONTHLY REVENUE LOSS**: Calculate based on local search volume and conversion rates
- **COMPETITIVE DISADVANTAGE**: Who is capturing their market share and how
- **2026 SURVIVAL PROGNOSIS**: Without intervention, what happens when AI search fully deploys

FORMATTING RULES:
- Start every paragraph with [H] for section subheaders
- Wrap all metrics, scores, and financial figures in **BOLD UPPERCASE**
- Use [FIX] for actionable strategic requirements (appears as highlighted boxes)
- Double space between all sections
- Tone: Uncompromising, elite strategist, South African market expert
- Never use generic advice - make it specific to ${businessName}'s implied industry
`;

  return await callHunterAI(researchPrompt);
};
