import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 1. FIREBASE SETUP
const firebaseConfigString = import.meta.env.VITE_FIREBASE_CONFIG;
let db: any = null;

try {
  if (firebaseConfigString) {
    const config = JSON.parse(firebaseConfigString);
    const app = initializeApp(config);
    db = getFirestore(app);
    console.log("✅ Entity Firebase: Active");
  }
} catch (error) {
  console.error("Firebase Config Failure");
}

export { db };

// 2. THE UNIVERSAL AI CALLER (Self-Healing)
export const callHunterAI = async (prompt: string) => {
  // Use every possible naming convention for the key to ensure it is found
  const KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY;
  
  if (!KEY) return "ERROR: API Key Missing. Please check GitHub Secrets.";

  // We try the Flash model first, then the Pro model as a fallback
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
          contents: [{ 
            parts: [{ 
              text: `SYSTEM: You are Hunter AI for Happy Hunter Digital. Expert in SA Marketing. 
              GOAL: Help SMEs survive the AI filter. 
              CTA: Book call at https://calendly.com/motsumitl/30min. 
              USER QUERY: ${prompt}` 
            }] 
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        return data.candidates[0].content.parts[0].text;
      }
    } catch (err) {
      console.warn("Retrying AI connection link...");
      continue;
    }
  }

  return "I'm having a connection hiccup. Please click the green WhatsApp button to chat with Thabo directly!";
};
