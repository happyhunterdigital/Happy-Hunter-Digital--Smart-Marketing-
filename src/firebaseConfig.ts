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
export const auth = getAuth(app); // FIXED: Exported for Admin

const KEY = "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";

export const callHunterAI = async (prompt: string) => {
  // RESTORED: Using gemini-flash-latest as requested
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${KEY}`;
  
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
    if (data.error) return `AI_ERROR: ${data.error.message} (${data.error.code})`;
    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    return "Handshake failed. Recalibrating signal...";
  }
};

export const performAuditAnalysis = async (bizName: string, location: string) => {
  const prompt = `You are Hunter AI, lead strategist at Smart Marketing SA. Perform a BRUTALLY HONEST strategic audit for "${bizName}" in ${location}. 
  Focus ONLY on pain points in SEO, Social, Footprint, and AEO. 
  MANDATORY: End with FINAL_SCORE: [number]. RULES: No asterisks, No markdown. Bold specific high-impact words with ALL CAPS.`;
  return await callHunterAI(prompt);
};
