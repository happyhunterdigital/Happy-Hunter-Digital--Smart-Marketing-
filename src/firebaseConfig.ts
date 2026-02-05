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
  console.error("Firebase Connection Error");
}

export { db };

// 2. THE AI ENTITY CALLER
// Using the v1beta endpoint and gemini-1.5-flash as verified by the debugger.
export const callHunterAI = async (prompt: string) => {
  const KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY;
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ 
            text: `SYSTEM INSTRUCTIONS: You are Hunter AI, the intelligence behind Happy Hunter Digital. 
            CONTEXT: Expert in South African Digital Marketing and AI Visibility. 
            TONE: High-authority, Strategic, Direct. 
            GOAL: Help businesses escape the 'Invisible Entity' trap. 
            CTA: Always direct users to book at https://calendly.com/motsumitl/30min.
            
            USER QUERY: ${prompt}` 
          }] 
        }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
      })
    });

    const data = await response.json();
    
    if (data.error) throw new Error(data.error.message);
    return data.candidates[0].content.parts[0].text;

  } catch (err) {
    console.error("AI Error:", err);
    return "Signal drop detected. Human support protocol suggested: WhatsApp Thabo directly or book a call at https://calendly.com/motsumitl/30min.";
  }
};
