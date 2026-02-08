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

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";

export const callHunterAI = async (prompt: string) => {
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
  
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4000 }
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
  const prompt = `You are Hunter AI, lead strategist at Smart Marketing South Africa.

AUDIT TARGET: "${businessName}" operating in ${location}

MISSION: Deliver an unsparing, elite strategic audit that reads like a confidential consulting report. NO AI MARKERS. NO ASTERISKS. NO ROBOTIC FORMATTING.

STRUCTURE - Use these exact markers:

[SECTION] LOCAL SEO & GOOGLE BUSINESS PROFILE
[H] The Visibility Gap
Write 2-3 sentences diagnosing why this business is invisible in local search. Be specific about GMB failures.
[METRIC] GMB Optimization Score: [number]/100
[METRIC] Critical Gap: [specific failure]
[FIX] Immediate action required to dominate local pack.

[SECTION] SOCIAL MEDIA PRESENCE
[H] Platform Breakdown
Analyze Instagram, Facebook, LinkedIn, TikTok presence. Identify signal failures.
[METRIC] Primary Platform: [platform] | Engagement Rate: [estimate]
[METRIC] Critical Gap: [specific failure]
[FIX] Social authority recovery protocol.

[SECTION] DIGITAL FOOTPRINT INTEGRITY
[H] Data Consistency Analysis
Review citation accuracy across South African directories.
[METRIC] Directory Presence: [percentage]
[METRIC] NAP Consistency: [status]
[FIX] Data integrity restoration.

[SECTION] AI VISIBILITY & ANSWER ENGINE OPTIMIZATION
[H] The LLM Blindspot
Can ChatGPT, Gemini, Perplexity recommend this business?
[METRIC] AI Citability: [Yes/No/Limited]
[METRIC] SGE Readiness: [score]/100
[FIX] AEO implementation strategy.

[SECTION] STRATEGIC VERDICT
[H] The Hard Truth
[METRIC] Overall Visibility Score: [0-100]
[METRIC] Estimated Monthly Revenue Loss: R[amount]
[METRIC] 2026 Survival Prognosis: [outcome without action]
[FIX] Priority recovery roadmap.

CRITICAL RULES:
- NEVER use asterisks (*) or markdown
- NEVER say "As an AI" or robotic phrases
- Write like a senior consultant speaking to a CEO
- Use [H] for headers, [METRIC] for data points, [FIX] for actions
- Tone: Direct, elite, uncompromising, South African market expert
- Each section should feel like a paid consulting deliverable`;
  
  return await callHunterAI(prompt);
};
