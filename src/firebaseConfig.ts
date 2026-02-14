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

// 1. THE SECRET SANITIZER (Removes accidental spaces/quotes)
const getSecret = (val: string | undefined) => (val || "").replace(/['"]+/g, '').trim();

const GEMINI_KEY = getSecret(import.meta.env.VITE_GEMINI_API_KEY);
const PLACES_KEY = getSecret(import.meta.env.VITE_PLACES_API_KEY);

// 2. THE STABLE AI CALLER (Gemini Flash Latest)
export const callHunterAI = async (prompt: string): Promise<string> => {
  if (!GEMINI_KEY) return "ERROR: AI Key not found in build. Re-run GitHub Action.";

  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_KEY}`;
  
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 3500 }
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return `AI_ERROR: ${data.error.message} (Code: ${data.error.code})`;
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Signal empty.";
  } catch (err: any) {
    return `CONNECTION_ERROR: ${err.message}`;
  }
};

// 3. SMART MARKETING GRAPH (MAPS)
export const fetchMapsData = async (bizName: string, location: string) => {
  if (!PLACES_KEY) return "MAPS_KEY_MISSING";
  
  const URL = "https://places.googleapis.com/v1/places:searchText";
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": PLACES_KEY,
        "X-Goog-FieldMask": "places.displayName.text,places.rating,places.userRatingCount,places.websiteUri"
      },
      body: JSON.stringify({ textQuery: `${bizName} in ${location}`, maxResultCount: 1 })
    });
    const data = await response.json();
    if (!data.places?.length) return "DATA_UNAVAILABLE";
    const biz = data.places[0];
    return `Verified Presence: ${biz.rating || "N/A"} stars, ${biz.userRatingCount || 0} reviews.`;
  } catch (err) { return "GRAPH_ERROR"; }
};

// 4. THE FORENSIC AUDIT
export const performAuditAnalysis = async (bizName: string, location: string): Promise<string> => {
  const mapsData = await fetchMapsData(bizName, location);
  const prompt = `You are Hunter AI for Smart Marketing SA. Perform a Strategic Forensic Audit for "${bizName}" in ${location}. 
  REAL DATA: ${mapsData}. MISSION: Expose pain points. NO asterisks. End with FINAL_SCORE: [number].`;
  return await callHunterAI(prompt);
};
