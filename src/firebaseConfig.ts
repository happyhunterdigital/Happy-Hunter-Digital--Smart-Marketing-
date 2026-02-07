import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 1. HARD-ALIGNED FIREBASE SETUP (happyhunterdigital-17480)
const firebaseConfig = {
  apiKey: "AIzaSyBQvZ2-w9DrJWQEgy4IarClycARAvMJIAc",
  authDomain: "happyhunterdigital-17480.firebaseapp.com",
  projectId: "happyhunterdigital-17480",
  storageBucket: "happyhunterdigital-17480.firebasestorage.app",
  messagingSenderId: "449102421348",
  appId: "1:449102421348:web:d61e0c209b93bf282fae71"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// 2. THE 2.5-FLASH AI CALLER (Sanitized)
export const callHunterAI = async (prompt: string) => {
  // THE SANITIZER: Automatically removes quotes or spaces from the secret
  const RAW_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY || "";
  const KEY = RAW_KEY.replace(/['"]+/g, '').trim();

  if (!KEY || KEY === "undefined") {
    return "SYSTEM_ERROR: API Key missing from build environment. Re-run GitHub Actions.";
  }

  // ALIGNED TO GEMINI 2.5 FLASH SPECIFICATIONS
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ 
            text: `SYSTEM: You are Hunter AI for Happy Hunter Digital. Expert in SA Marketing. 
            TONE: Professional, Provocative, Strategic. 
            ENGINE: Gemini 2.5 Flash reasoning model.
            QUERY: ${prompt}` 
          }] 
        }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
      })
    });

    const data = await response.json();
    
    if (data.error) {
      // If the key is still invalid, we show exactly what Google sees (without leaking the key)
      return `GOOGLE_REJECTION: ${data.error.message} (Code: ${data.error.code}). Check if your key is restricted to specific domains in Cloud Console.`;
    }

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return data.candidates[0].content.parts[0].text;
    }
    
    return "ERROR: Signal established but response was empty.";

  } catch (err: any) {
    return `NETWORK_FAILURE: ${err.message}. Check browser for CORS or Ad-blocker interruptions.`;
  }
};
