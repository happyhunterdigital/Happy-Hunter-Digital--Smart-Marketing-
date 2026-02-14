import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "happyhunterdigital-17480.firebaseapp.com",
  projectId: "happyhunterdigital-17480",
  storageBucket: "happyhunterdigital-17480.firebasestorage.app",
  messagingSenderId: "449102421348",
  appId: "1:449102421348:web:d61e0c209b93bf282fae71",
  measurementId: "G-PS04HKGEXF"
};

// INITIALIZATION WITH CRASH PROTECTION
let db: any = null;
let auth: any = null;

try {
  if (firebaseConfig.apiKey) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  }
} catch (e) { console.error("Firebase Init Offline"); }

export { db, auth };

// RESTORING THE STRATEGIC AI ENGINE
export const callHunterAI = async (prompt: string) => {
  const KEY = import.meta.env.VITE_GEMINI_API_KEY;
  if (!KEY) return "ERROR: API Key not found. Please re-run the GitHub build.";

  // Hard-aligned to your 2.5 Flash reasoning model
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
    const data = await response.json();
    if (data.error) return `AI_ERROR: ${data.error.message}`;
    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    return "Handshake lost. Please WhatsApp Thabo directly.";
  }
};

export const performAuditAnalysis = async (bizName: string, location: string) => {
  const prompt = `You are Hunter AI, lead strategist at Smart Marketing. Perform a BRUTALLY HONEST forensic audit for "${bizName}" in ${location}. 
  Expose pain points in Local SEO, Social signals, and AEO visibility. 
  RULES: Use [SECTION] for headers. NO asterisks.
  MANDATORY: End with FINAL_SCORE: [number].`;
  return await callHunterAI(prompt);
};
