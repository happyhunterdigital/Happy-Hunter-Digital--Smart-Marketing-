import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 1. FIREBASE INITIALIZATION
const firebaseConfigString = import.meta.env.VITE_FIREBASE_CONFIG;
let db: any = null;

try {
  if (firebaseConfigString) {
    const config = JSON.parse(firebaseConfigString);
    const app = initializeApp(config);
    db = getFirestore(app);
  }
} catch (error) {
  console.error("Firebase Auth Error");
}

export { db };

// 2. THE ENTITY CALLER (REFINED)
export const callHunterAI = async (prompt: string) => {
  const KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY;
  
  // Using v1beta for maximum compatibility with the newest Flash models
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("Gemini Error:", data.error.message);
      return `ENTITY ERROR: ${data.error.message}`;
    }

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return data.candidates[0].content.parts[0].text;
    }
    
    return "Signal established but data returned empty.";
  } catch (err) {
    return "I am currently re-calibrating my signals. Please click the green WhatsApp button for support!";
  }
};
