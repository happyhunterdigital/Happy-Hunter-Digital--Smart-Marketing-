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
  // CRITICAL FIX: No space after key=
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2000 }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return `SYSTEM_ERROR: ${errorData.error?.message || `HTTP ${response.status}`}`;
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (err: any) {
    return `CONNECTION_ERROR: ${err.message}`;
  }
};

export const performAuditAnalysis = async (businessName: string, location: string) => {
  const researchPrompt = `
    You are an elite Smart Marketing Auditor. Perform an UNSPARING audit for "${businessName}" in ${location}.
    FOCUS ONLY ON PAIN POINTS AND FAILURES.
    
    STRUCTURE:
    [SECTION] LOCAL SEO & GMB FAILURES
    - Identify specific visibility gaps and missing trust signals.
    [SECTION] SOCIAL MEDIA Voids
    - Analyze the brand signal failures on Instagram, FB, and TikTok.
    [SECTION] DIGITAL FOOTPRINT GAPS
    - Identify data inconsistency across directories.
    [SECTION] AI/LLM INVISIBILITY (AEO)
    - Explain why ChatGPT and Gemini cannot trust or recommend this business.
    [SECTION] STRATEGIC VERDICT
    - Estimate monthly revenue loss from invisibility.
    
    FORMATTING:
    - Use [H] for paragraph intros.
    - Use **BOLD UPPERCASE** for critical failures.
    - Use [FIX] for immediate requirements.
    - Space paragraphs generously.
    - TONE: Blunt, Professional, Urgent.
  `;
  return await callHunterAI(researchPrompt);
};
