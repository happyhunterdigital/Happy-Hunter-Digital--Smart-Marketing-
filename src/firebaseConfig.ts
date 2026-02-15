import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
export const auth = getAuth(app);

// 1. THE SECRET SANITIZER
const getSecret = (val: string | undefined) => (val || "").replace(/['"]+/g, '').trim();

const GEMINI_KEY = getSecret(import.meta.env.VITE_GEMINI_API_KEY) || "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";

export const callHunterAI = async (prompt: string): Promise<string> => {
  // CRITICAL: Handshake aligned to v1beta and gemini-2.5-flash with NO spaces
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
  
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4000 }
      })
    });

    const data = await response.json();
    if (data.error) return `AI_ERROR: ${data.error.message}`;
    
    // THE CLEANER: Stripping all asterisks and robotic markers
    return data.candidates[0].content.parts[0].text.replace(/\*/g, '').trim();
  } catch (err: any) {
    return "Handshake failed. Protocol recalibrating.";
  }
};

export const performAuditAnalysis = async (bizName: string, location: string) => {
  const prompt = `You are Hunter AI for Smart Marketing SA. Perform an unsparing strategic audit for "${bizName}" in ${location}. 
  FOCUS: Pain points in Local SEO, Social signals, and AI visibility. NO asterisks.
  MANDATORY: End with exactly FINAL_SCORE: [number]. Bold key words with ALL CAPS.`;
  return await callHunterAI(prompt);
};
