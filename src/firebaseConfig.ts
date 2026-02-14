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
export const auth = getAuth(app); // SECURED: For Admin access

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";
const PLACES_KEY = import.meta.env.VITE_PLACES_API_KEY || GEMINI_KEY;

// 1. THE STABLE AI CALLER (Restored to Gemini Flash Latest)
export const callHunterAI = async (prompt: string): Promise<string> => {
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_KEY}`;
  
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4000 }
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      return `AI_ERROR: ${error.error?.message || "Signal lost."}`;
    }
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Signal empty.";
  } catch (err) {
    return "Handshake failed. Protocol recalibrating.";
  }
};

// 2. SMART MARKETING GRAPH (GOOGLE MAPS)
export const fetchMapsData = async (bizName: string, location: string) => {
  const URL = "https://places.googleapis.com/v1/places:searchText";
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": PLACES_KEY,
        "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri"
      },
      body: JSON.stringify({ textQuery: `${bizName} in ${location}`, maxResultCount: 1 })
    });
    const data = await response.json();
    if (!data.places?.length) return "DATA_UNAVAILABLE";
    const biz = data.places[0];
    return `✓ Verified Presence Found. Rating: ${biz.rating || "N/A"} stars. Reviews: ${biz.userRatingCount || 0}.`;
  } catch (err) { return "GRAPH_CONNECTION_ERROR"; }
};

// 3. THE FORENSIC AUDIT (Using verified Model)
export const performAuditAnalysis = async (bizName: string, location: string): Promise<string> => {
  const mapsData = await fetchMapsData(bizName, location);
  const prompt = `You are Hunter AI for Smart Marketing SA. Perform a Strategic Audit for "${bizName}" in ${location}. 
  REAL DATA: ${mapsData}. 
  MISSION: Expose pain points. NO asterisks. End with exactly FINAL_SCORE: [number].`;
  return await callHunterAI(prompt);
};
