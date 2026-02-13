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

// Pulling the new keys from the build environment
const PLACES_KEY = import.meta.env.VITE_PLACES_API_KEY;
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const fetchMapsData = async (bizName: string, location: string) => {
  if (!PLACES_KEY) return { error: true, message: "KEY_NOT_INJECTED" };
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
    if (!data.places || data.places.length === 0) return { error: true, message: "GHOST_ENTITY" };
    const biz = data.places[0];
    return {
      found: true,
      rating: biz.rating || "N/A",
      reviews: biz.userRatingCount || 0,
      website: biz.websiteUri || "MISSING"
    };
  } catch (err) { return { error: true, message: "FETCH_FAILED" }; }
};

export const callHunterAI = async (prompt: string) => {
  // Using v1beta for the 2.5-flash reasoning engine
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
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
    if (data.error) return `AI_ERROR: ${data.error.message}`;
    return data.candidates[0].content.parts[0].text;
  } catch (err) { return "Handshake failed."; }
};

export const performAuditAnalysis = async (bizName: string, location: string) => {
  const mapsData: any = await fetchMapsData(bizName, location);
  const dataContext = mapsData.found 
    ? `✓ VERIFIED: Rating ${mapsData.rating}, Reviews ${mapsData.reviews}.`
    : `× INVISIBLE: No Maps data found for this entity. Error: ${mapsData.message}`;

  const prompt = `You are Hunter AI, lead strategist for Smart Marketing SA. Perform a Forensic Audit for "${bizName}" in ${location}. 
  DATA: ${dataContext}. MISSION: Expose pain points. 
  MANDATORY: End with FINAL_SCORE: [number]. RULES: No asterisks, No markdown.`;
  return await callHunterAI(prompt);
};
