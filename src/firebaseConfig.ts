import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 1. INITIALIZE FIREBASE
// We parse the JSON string you saved in your GitHub Secrets
const firebaseConfigString = import.meta.env.VITE_FIREBASE_CONFIG;
let app;
let db: any = null;
let auth: any = null;

try {
  if (firebaseConfigString) {
    const config = JSON.parse(firebaseConfigString);
    app = initializeApp(config);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("✅ Firebase Entity Protocol Active.");
  }
} catch (error) {
  console.error("❌ Firebase Initialization Failed. Check VITE_FIREBASE_CONFIG Secret.");
}

export { db, auth };

// 2. AI ENGINE: THE DAISY CHAIN
/**
 * This function handles the connection to Google's AI. 
 * It tries multiple models automatically if one fails, 
 * preventing the "No Connection" error on your live site.
 */
export const callHunterAI = async (prompt: string) => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY;
  
  // These are the models we try in order
  const MODELS = [
    { name: "gemini-1.5-flash", version: "v1beta" },
    { name: "gemini-1.5-pro", version: "v1beta" },
    { name: "gemini-pro", version: "v1" }
  ];

  for (const model of MODELS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/${model.version}/models/${model.name}:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ 
                text: `SYSTEM INSTRUCTIONS: You are Hunter AI for Happy Hunter Digital. 
                Focus: Digital Entity Management & AI Visibility for SA SMEs. 
                Goal: Direct users to book at https://calendly.com/motsumitl/30min.
                USER QUERY: ${prompt}` 
              }] 
            }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
          })
        }
      );

      const data = await response.json();
      
      // If we get a valid answer, return it immediately
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
    } catch (e) {
      console.warn(`Model ${model.name} failed, switching to next link in chain...`);
      continue;
    }
  }

  // Fallback if all models fail
  return "I'm having a connection hiccup. Please WhatsApp us directly for support!";
};
