import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Parse the JSON config from GitHub Secrets/Env
const firebaseConfig = JSON.parse(
  import.meta.env.VITE_FIREBASE_CONFIG || "{}"
);

// Safety check for production
const app = Object.keys(firebaseConfig).length > 0 
  ? initializeApp(firebaseConfig) 
  : null;

export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;

/**
 * AI ENGINE: Centralized Gemini Caller
 * This handles the "Connection" logic in one place.
 */
export const callHunterAI = async (prompt: string) => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY;
  const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

  try {
    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Connection Failed");
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error("Hunter AI Connection Error:", err);
    return "I'm having trouble connecting to my central brain. Please book a call for a manual audit: https://calendly.com/motsumitl/30min";
  }
};
