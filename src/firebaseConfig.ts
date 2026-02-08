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
  // FIXED: Removed space before key. Aligned to v1beta for 2.5-Flash
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
      const errorData = await response.json();
      return `GOOGLE_ERROR: ${errorData.error?.message || "Handshake Rejected"}`;
    }

    const data = await response.json();
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
    - Identify specific gaps and missing trust signals.
    [SECTION] SOCIAL MEDIA VOID
    - Analyze signal failures and community engagement gaps.
    [SECTION] DIGITAL FOOTPRINT GAPS
    - Identify data inconsistency across the web.
    [SECTION] ONLINE VISIBILITY & AEO
    - Explain why AI models cannot trust or cite this business.
    
    FORMATTING RULES:
    - paragraphs started with [H] for emphasis.
    - **BOLD CAPITAL LETTERS** for critical failures.
    - [FIX] for immediate strategic requirements.
    - Use double spacing between sections.
  `;
  return await callHunterAI(prompt);
};
