import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "happyhunterdigital-17480.firebaseapp.com",
  projectId: "happyhunterdigital-17480",
  storageBucket: "happyhunterdigital-17480.firebasestorage.app",
  messagingSenderId: "449102421348",
  appId: "1:449102421348:web:d61e0c209b93bf282fae71",
  measurementId: "G-PS04HKGEXF"
};

let db: any = null;
let auth: any = null;

try {
  if (firebaseConfig.apiKey) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  }
} catch (e) { console.error("Database Handshake Offline"); }

export { db, auth };

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const PLACES_KEY = import.meta.env.VITE_PLACES_API_KEY; // CRITICAL: Forensic Key

// 1. FORENSIC GRAPH SEARCH (REAL DATA)
export const fetchMapsData = async (bizName: string, location: string) => {
  if (!PLACES_KEY) return "HANDSHAKE_ERROR: Places API Key Missing.";
  
  const URL = "https://places.googleapis.com/v1/places:searchText";
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": PLACES_KEY,
        "X-Goog-FieldMask": "places.displayName.text,places.rating,places.userRatingCount,places.websiteUri,places.formattedAddress"
      },
      body: JSON.stringify({ textQuery: `${bizName} in ${location}`, maxResultCount: 1 })
    });
    const data = await response.json();
    if (!data.places || data.places.length === 0) return "DATA_UNAVAILABLE: Entity invisible in the Graph.";
    const biz = data.places[0];
    return `Verified Data: ${biz.displayName?.text}. Rating: ${biz.rating || "N/A"}. Reviews: ${biz.userRatingCount || 0}. Website: ${biz.websiteUri || "Missing"}.`;
  } catch (err) { return "NETWORK_ERROR"; }
};

// 2. THE CLEAN AI CALLER (Strips Markdown)
export const callHunterAI = async (prompt: string) => {
  if (!GEMINI_KEY) return "ERROR: AI Signal Interrupted.";

  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
  
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2000 }
      })
    });
    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    
    // THE CLEANER: Remove every asterisk and robotic marker from the result
    return text.replace(/\*/g, '').replace(/###/g, '').trim();
  } catch (err) { return "Handshake failed."; }
};

export const performAuditAnalysis = async (bizName: string, location: string) => {
  const mapsData = await fetchMapsData(bizName, location);
  const prompt = `You are Hunter AI. Perform a strategic audit for "${bizName}" in ${location}. 
  REAL DATA FOUND: ${mapsData}. 
  Expose pain points. NO asterisks. Use [H] for emphasis. Use [SECTION] for headers. 
  MANDATORY: End with FINAL_SCORE: [number].`;
  return await callHunterAI(prompt);
};
