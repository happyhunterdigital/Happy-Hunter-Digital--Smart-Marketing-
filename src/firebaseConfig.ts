// src/firebaseConfig.ts
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

export const callHunterAI = async (prompt: string) => {
  const KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  // CRITICAL FIX: Removed space after key=
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
      return `GOOGLE_ERROR: ${errorData.error?.message || "Request failed"}`;
    }
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
  } catch (err: any) {
    return `CONNECTION_ERROR: ${err.message}`;
  }
};

export const performAuditAnalysis = async (bizName: string, location: string) => {
  const prompt = `You are Hunter AI for Smart Marketing. Perform a Strategic Audit for "${bizName}" in ${location}. 
  FOCUS: Pain points in SEO, Social, Footprint, and AEO.
  
  MANDATORY REQUIREMENT: At the very end of your response, you MUST write exactly: 
  FINAL_SCORE: [number between 0 and 100]
  
  RULES: Use [SECTION] for headers, [FIX] for actions, NO asterisks.`;
  return await callHunterAI(prompt);
};
