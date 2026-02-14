import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG || "{}");

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// CALLING KEYS FROM GITHUB SECRETS
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const PLACES_KEY = import.meta.env.VITE_PLACES_API_KEY;

export const callHunterAI = async (prompt: string) => {
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;
  
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
    return data.candidates[0].content.parts[0].text;
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
        "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri"
      },
      body: JSON.stringify({ textQuery: `${bizName} in ${location}`, maxResultCount: 1 })
    });
    const data = await response.json();
    if (!data.places || data.places.length === 0) return "DATA_UNAVAILABLE";
    const biz = data.places[0];
    return `✓ Verified Presence Found. Rating: ${biz.rating || "N/A"} stars. Reviews: ${biz.userRatingCount || 0}.`;
  } catch (err) { return "GRAPH_CONNECTION_ERROR"; }
};

export const performAuditAnalysis = async (bizName: string, location: string) => {
  const mapsData = await fetchMapsData(bizName, location);
  const prompt = `You are Hunter AI. Perform a strategic audit for "${bizName}" in ${location}. Focus on pain points. No asterisks. End with FINAL_SCORE: [number].`;
  return await callHunterAI(prompt);
};
