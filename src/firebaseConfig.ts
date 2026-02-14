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

// API Keys
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";
const PLACES_KEY = import.meta.env.VITE_PLACES_API_KEY || GEMINI_KEY;

// 1. SMART MARKETING GRAPH (MAPS)
export const fetchMapsData = async (bizName: string, location: string) => {
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
  } catch (err) { return "DATA_FETCH_FAILED"; }
};

// 2. THE UNIVERSAL AI CALLER (Daisy Chain Logic)
export const callHunterAI = async (prompt: string): Promise<string> => {
  // We try these configurations in order until one works
  const ATTEMPTS = [
    { version: "v1", model: "gemini-1.5-flash" }, // Stable Road
    { version: "v1beta", model: "gemini-1.5-flash" }, // Beta Road
    { version: "v1beta", model: "gemini-2.0-flash" } // Experimental Road
  ];

  for (const config of ATTEMPTS) {
    try {
      const URL = `https://generativelanguage.googleapis.com/${config.version}/models/${config.model}:generateContent?key=${GEMINI_KEY}`;
      
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2000 }
        })
      });

      const data = await response.json();

      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.log(`✅ Handshake Success via ${config.model} (${config.version})`);
        return data.candidates[0].content.parts[0].text;
      }
      
      // If we hit a 429 (Quota), we stop and tell the user
      if (data.error?.code === 429) {
        return "ERROR: Capacity reached. Please try again in 60 seconds.";
      }

    } catch (err) {
      console.warn(`Attempt with ${config.model} failed, trying next...`);
    }
  }

  return "CRITICAL_ERROR: All AI signal paths are blocked. Check API key status in Google Cloud.";
};

// 3. THE FORENSIC AUDIT
export const performAuditAnalysis = async (bizName: string, location: string): Promise<string> => {
  const mapsData = await fetchMapsData(bizName, location);
  const prompt = `You are Hunter AI for Smart Marketing. Perform a strategic audit for "${bizName}" in ${location}. 
  REAL DATA: ${mapsData}. Expose pain points. NO asterisks. End with FINAL_SCORE: [number].`;
  return await callHunterAI(prompt);
};
