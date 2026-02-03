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
    console.log("✅ Entity Connection: Stable");
  }
} catch (error) {
  console.error("❌ Entity Connection: Failed. Check VITE_FIREBASE_CONFIG Secret.");
}

export { db };

// 2. AI ENGINE: THE MASTER CALLER
export const callHunterAI = async (prompt: string) => {
  const KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY;
  // We use the v1beta endpoint for the latest 1.5-flash model
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ 
            text: `SYSTEM INSTRUCTIONS: You are Hunter AI for Happy Hunter Digital. 
            Focus: Digital Entity Management for South African SMEs. 
            Behavior: Strategic, Professional, Direct. 
            CTA: Suggest booking at https://calendly.com/motsumitl/30min.
            
            USER QUERY: ${prompt}` 
          }] 
        }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.candidates[0].content.parts[0].text;
  } catch (err: any) {
    console.warn("AI Handshake Failed:", err.message);
    return "I am currently re-calibrating my signals. Please click the green WhatsApp button for immediate human support!";
  }
};
