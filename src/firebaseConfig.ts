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
export const auth = getAuth(app); // EXPORTED FOR ADMIN OPS

// CALLING KEYS FROM THE SECURE VAULT
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const PLACES_KEY = import.meta.env.VITE_PLACES_API_KEY;

// 1. THE SMART MARKETING GRAPH (MAPS API)
export const fetchMapsData = async (bizName: string, location: string) => {
  if (!PLACES_KEY) return "ERROR: Maps key missing.";
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
    if (!data.places?.length) return "DATA_UNAVAILABLE: Handshake refused by Knowledge Graph.";
    const biz = data.places[0];
    return `✓ Verified Presence. Rating: ${biz.rating || "N/A"} stars. Reviews: ${biz.userRatingCount || 0}. Website: ${biz.websiteUri || "Missing"}.`;
  } catch (err) { return "GRAPH_ERROR"; }
};

// 2. THE UNIVERSAL AI CALLER (GEMINI 2.5 FLASH)
export const callHunterAI = async (prompt: string) => {
  if (!GEMINI_KEY) return "ERROR: AI key missing.";
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
    return data.candidates[0].content.parts[0].text;
  } catch (err) { return "Handshake failed."; }
};

// 3. THE FORENSIC AUDIT ANALYSIS
export const performAuditAnalysis = async (bizName: string, location: string) => {
  const mapsData = await fetchMapsData(bizName, location);
  const prompt = `You are Hunter AI. Perform a Strategic Audit for "${bizName}" in ${location}. 
  REAL DATA: ${mapsData}. 
  FOCUS: Pain points in SEO, Social, Footprint, and AEO.
  MANDATORY: End with FINAL_SCORE: [number]. RULES: No asterisks, No markdown. Use CAPS for critical words.`;
  return await callHunterAI(prompt);
};
