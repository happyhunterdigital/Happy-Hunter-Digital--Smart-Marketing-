// src/firebaseConfig.ts - EMERGENCY RESTORE VERSION
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQvZ2-w9DrJWQEgy4IarClycARAvMJIAc",
  authDomain: "happyhunterdigital-17480.firebaseapp.com",
  projectId: "happyhunterdigital-17480",
  storageBucket: "happyhunterdigital-17480.firebasestorage.app",
  messagingSenderId: "449102421348",
  appId: "1:449102421348:web:d61e0c209b93bf282fae71",
  measurementId: "G-PS04HKGEXF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// TEMPORARY: Hardcoded API key to restore service
const GEMINI_KEY = "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";

export const callHunterAI = async (prompt: string) => {
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
  
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

export const performAuditAnalysis = async (businessName: string, location: string) => {
  const prompt = `You are Hunter AI for Smart Marketing. Audit "${businessName}" in ${location}. Focus on pain points. Use [SECTION], [H], [FIX] formatting. No asterisks.`;
  return await callHunterAI(prompt);
};
