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

// SECRET SANITIZER
const getSecret = (val: string | undefined) => (val || "").replace(/['"]+/g, '').trim();

const GEMINI_KEY = getSecret(import.meta.env.VITE_GEMINI_API_KEY) || "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";
const PLACES_KEY = getSecret(import.meta.env.VITE_PLACES_API_KEY) || GEMINI_KEY;

export const callHunterAI = async (prompt: string) => {
  // ALIGNED TO GEMINI 2.5 FLASH
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
    // THE CLEANER: No more asterisks
    return data.candidates[0].content.parts[0].text.replace(/\*/g, '');
  } catch (err) {
    return "Handshake failed. Protocol recalibrating.";
  }
};

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
    return `Verified Presence Found. Rating: ${biz.rating || "N/A"} stars. Reviews: ${biz.userRatingCount || 0}. Website: ${biz.websiteUri || "Missing"}.`;
  } catch (err) { return "GRAPH_ERROR"; }
};

export const performAuditAnalysis = async (bizName: string, location: string) => {
  const mapsData = await fetchMapsData(bizName, location);
  const prompt = `You are Hunter AI, lead strategist for Smart Marketing SA. Perform a Strategic Audit for "${bizName}" in ${location}. 
  REAL DATA: ${mapsData}. 
  MISSION: Expose pain points. NO asterisks. End with FINAL_SCORE: [number]. Bold critical words with ALL CAPS.`;
  return await callHunterAI(prompt);
};
