import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 1. INITIALIZE FIREBASE
const firebaseConfigString = import.meta.env.VITE_FIREBASE_CONFIG;
let db: any = null;

try {
  if (firebaseConfigString) {
    const config = JSON.parse(firebaseConfigString);
    const app = initializeApp(config);
    db = getFirestore(app);
  }
} catch (error) {
  console.error("Firebase Config Error");
}

export { db };

// 2. THE DAISY-CHAIN AI CALLER
export const callHunterAI = async (prompt: string) => {
  const KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY;
  
  // We try these endpoints in order. If one fails, we try the next.
  const ENDPOINTS = [
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent"
  ];

  for (const url of ENDPOINTS) {
    try {
      const response = await fetch(`${url}?key=${KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        return data.candidates[0].content.parts[0].text;
      }
    } catch (err) {
      console.warn("Retrying AI connection via fallback link...");
      continue;
    }
  }

  return "SIGNAL LOSS: My central brain is recalibrating. Please click the green button to WhatsApp us directly!";
};
