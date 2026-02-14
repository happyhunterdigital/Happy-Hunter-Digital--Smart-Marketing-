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

const KEY = "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";

// 1. SMART MARKETING GRAPH SEARCH
export const fetchMapsData = async (bizName: string, location: string) => {
  const URL = "https://places.googleapis.com/v1/places:searchText";
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": KEY,
        "X-Goog-FieldMask": "places.displayName.text,places.rating,places.userRatingCount,places.websiteUri"
      },
      body: JSON.stringify({ textQuery: `${bizName} in ${location}`, maxResultCount: 1 })
    });
    const data = await response.json();
    if (!data.places?.length) return "DATA_UNAVAILABLE";
    const biz = data.places[0];
    return `Verified Presence Found. Rating: ${biz.rating || "N/A"} stars. Reviews: ${biz.userRatingCount || 0}.`;
  } catch (err) { return "GRAPH_ERROR"; }
};

// 2. THE UNIVERSAL AI CALLER
export const callHunterAI = async (prompt: string) => {
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`;
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7 } })
    });
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (err) { return "Handshake failed."; }
};

// 3. THE UNSPARING AUDIT ANALYSIS
export const performAuditAnalysis = async (bizName: string, location: string) => {
  const mapsData = await fetchMapsData(bizName, location);
  const prompt = `You are Hunter AI for Smart Marketing. Perform a Strategic Forensic Audit for "${bizName}" in ${location}. 
  REAL DATA: ${mapsData}. MISSION: Expose pain points. NO asterisks. End with FINAL_SCORE: [number].`;
  return await callHunterAI(prompt);
};
