import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBQvZ2-w9DrJWQEgy4IarClycARAvMJIAc",
  authDomain: "happyhunterdigital-17480.firebaseapp.com",
  projectId: "happyhunterdigital-17480",
  storageBucket: "happyhunterdigital-17480.firebasestorage.app",
  messagingSenderId: "449102421348",
  appId: "1:449102421348:web:d61e0c209b93bf282fae71",
  measurementId: "G-PS04HKGEXF"
};

let db: any = null;
let auth: any = null;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  console.log("✅ Handshake: Firebase initialized.");
} catch (error: any) {
  console.error("❌ Handshake: Firebase restricted.", error.message);
  // System continues to allow AI logic even if DB is offline
}

export { db, auth };

// THE VERIFIED HANDSHAKE KEY
const KEY = "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";

export const callHunterAI = async (prompt: string) => {
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`;
  
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4000 }
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      return `SYSTEM_ERROR: ${data.error.message || "Protocol handshake interrupted"}`;
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (err: any) {
    return `SYSTEM_ERROR: Connection dropped (${err.message})`;
  }
};

export const performAuditAnalysis = async (bizName: string, location: string) => {
  const prompt = `You are Hunter AI, lead strategist at Smart Marketing. Perform a Strategic Audit for "${bizName}" in ${location}. 
  FOCUS: Pain points in SEO, Social, Footprint, and AEO.
  MANDATORY: End with FINAL_SCORE: [number]. RULES: No asterisks, No markdown. Bold high-impact words with ALL CAPS.`;
  return await callHunterAI(prompt);
};
