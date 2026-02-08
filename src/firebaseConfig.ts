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
  const KEY = "AIzaSyCdmPzVLVk0s7prinSgvxulfBZxLBTsA6U";
  // ACTUAL FIX: No space after key=
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.9, maxOutputTokens: 2000 }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return `GOOGLE_ERROR: ${errorData.error?.message || "Handshake Rejected"}`;
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return "SYSTEM_ERROR: Empty response from AI.";
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (err: any) {
    return `CONNECTION_ERROR: ${err.message}`;
  }
};

export const performAuditAnalysis = async (businessName: string, location: string) => {
  const prompt = `
PERFORM AN UNSPARING STRATEGIC AUDIT FOR: "${businessName}" in ${location}.
IDENTITY: Elite Strategic Auditor for Smart Marketing. FOCUS ONLY ON PAIN POINTS.

STRUCTURE YOUR RESPONSE EXACTLY AS FOLLOWS:
[SECTION] LOCAL SEO & GMB FAILURES
[H] Current State Analysis
- Identify specific gaps and missing trust signals.
[FIX] Immediate requirements for Local SEO.

[SECTION] SOCIAL MEDIA VOID
[H] Platform Analysis  
- Analyze signal failures and community engagement gaps.
[FIX] Social Media Recovery Protocol.

[SECTION] DIGITAL FOOTPRINT GAPS
[H] Data Consistency Issues
- Identify data inconsistency across the web.
[FIX] Footprint Repair Strategy.

[SECTION] ONLINE VISIBILITY & AEO
[H] AI Model Findability
- Explain why AI models cannot trust or cite this business.
[FIX] AEO Implementation Requirements.

FORMATTING RULES:
- Start paragraphs with [H] for emphasis.
- Use **BOLD CAPITAL LETTERS** for critical failures.
- Use [FIX] for immediate strategic requirements.
- Use double spacing between sections.
`;
  return await callHunterAI(prompt);
};
