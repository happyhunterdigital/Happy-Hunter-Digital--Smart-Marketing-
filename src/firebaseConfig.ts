// src/firebaseConfig.ts
import { initializeApp } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_CONFIG ? JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG).apiKey : "fallback-key",
  // ... rest of config
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const callHunterAI = async (prompt: string) => {
  const KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!KEY) {
    console.error("VITE_GEMINI_API_KEY not found");
    return "CONFIG_ERROR: API key not configured. Check environment variables.";
  }
  
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return `GOOGLE_ERROR: ${errorData.error?.message || "API request failed"}`;
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
  } catch (err: any) {
    return `CONNECTION_ERROR: ${err.message}`;
  }
};
