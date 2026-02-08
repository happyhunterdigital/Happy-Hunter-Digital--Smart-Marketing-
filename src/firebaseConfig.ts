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

export const callHunterAI = async (prompt: string) => {
  const KEY = "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";
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
      return `GOOGLE_ERROR: ${errorData.error?.message || "API request failed"}`;
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return "SYSTEM_ERROR: No response from AI engine.";
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (err: any) {
    return `CONNECTION_ERROR: ${err.message}`;
  }
};

export const performAuditAnalysis = async (businessName: string, location: string) => {
  const prompt = `You are Hunter AI, an elite digital marketing strategist for Smart Marketing South Africa.

AUDIT TARGET: "${businessName}" in ${location}

Provide a BRUTALLY HONEST strategic audit focusing on PAIN POINTS ONLY.

FORMAT YOUR RESPONSE EXACTLY:

[SECTION] LOCAL SEO & GMB FAILURES
[H] Current Visibility Crisis
- **GMB OPTIMIZATION SCORE**: Estimate 0-100
- **CRITICAL FAILURES**: Why they don't appear in local pack
- **NAP CHAOS**: Directory inconsistencies
[FIX] Immediate Local SEO Requirements

[SECTION] SOCIAL MEDIA VOID
[H] Platform Breakdown  
- **INSTAGRAM**: Content/follower gaps
- **FACEBOOK**: Community engagement failures
- **LINKEDIN**: B2B authority absence
[FIX] Social Recovery Protocol

[SECTION] DIGITAL FOOTPRINT GAPS
[H] Data Consistency Issues
- **CITATION ACCURACY**: Missing from key directories
- **REVIEW VELOCITY**: Acquisition rate problems
[FIX] Footprint Repair Strategy

[SECTION] AI VISIBILITY & AEO
[H] LLM Findability Crisis
- **CHATGPT CITABILITY**: Can AI recommend them?
- **SGE READINESS**: Prepared for AI search?
[FIX] AEO Implementation

[SECTION] STRATEGIC VERDICT
[H] The Hard Truth
- **VISIBILITY SCORE**: 0-100
- **ESTIMATED REVENUE LOSS**: Monthly figure
- **2026 PROGNOSIS**: Without action

RULES:
- Use [H] for headers
- Use **BOLD CAPS** for critical data
- Use [FIX] for action items
- Double space between sections
- Tone: Uncompromising, expert, urgent`;
  
  return await callHunterAI(prompt);
};
