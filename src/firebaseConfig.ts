import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
export const auth = getAuth(app);

// THE VERIFIED KEY FROM YOUR SCREENSHOT
const KEY = "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";

export const callHunterAI = async (prompt: string) => {
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`;
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 3000 }
      })
    });
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    return "Signal lost. Contact Thabo directly.";
  }
};

export const performAuditAnalysis = async (bizName: string, location: string) => {
  const prompt = `You are Hunter AI for Smart Marketing SA. Perform a BRUTALLY HONEST audit for "${bizName}" in ${location}. 
  Expose pain points in SEO, Social, Footprint, and AEO. 
  MANDATORY: End with FINAL_SCORE: [number]. RULES: No asterisks, No markdown.`;
  return await callHunterAI(prompt);
};
