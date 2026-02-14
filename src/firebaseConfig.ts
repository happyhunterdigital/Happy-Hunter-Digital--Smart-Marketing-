import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 1. DYNAMIC CONFIGURATION (Safe)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: "happyhunterdigital-17480.firebaseapp.com",
  projectId: "happyhunterdigital-17480",
  storageBucket: "happyhunterdigital-17480.firebasestorage.app",
  messagingSenderId: "449102421348",
  appId: "1:449102421348:web:d61e0c209b93bf282fae71",
  measurementId: "G-PS04HKGEXF"
};

// 2. SAFETY SHIELD INITIALIZATION
let db: any = null;
let auth: any = null;

try {
  // Only attempt initialization if the key exists to prevent the Auth error
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "") {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("✅ Handshake: Firebase Protocol Active.");
  } else {
    console.warn("⚠️ Handshake: API Key missing. Running in limited mode.");
  }
} catch (error) {
  console.error("CRITICAL: Firebase initialization suppressed to prevent system flicker.");
}

export { db, auth };

// 3. SECURE AI CALLER
export const callHunterAI = async (prompt: string) => {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    return "PROTOCOL_OFFLINE: The AI core is currently restricted. Please message Thabo directly.";
  }

  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
      })
    });
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    return "SIGNAL_LOST: Handshake timed out.";
  }
};

export const performAuditAnalysis = async (bizName: string, location: string) => {
  const prompt = `You are Hunter AI. Perform a Strategic Audit for "${bizName}" in ${location}. Focus on pain points. No asterisks. End with FINAL_SCORE: [number].`;
  return await callHunterAI(prompt);
};
