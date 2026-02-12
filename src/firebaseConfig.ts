import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 1. HARD-ALIGNED FIREBASE (Direct from your screenshot)
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

// 2. THE VERIFIED HANDSHAKE
// Using the key you confirmed works: AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs
const KEY = "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";

export const callHunterAI = async (prompt: string) => {
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`;
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 2500 }
      })
    });
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (err) { return "Handshake interrupted."; }
};

export const fetchMapsData = async (bizName: string, location: string) => {
  const URL = "https://places.googleapis.com/v1/places:searchText";
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": KEY,
        // FIXED FIELD MASK: Uses the exact paths required by the Google V1 API
        "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri,places.formattedAddress"
      },
      body: JSON.stringify({ textQuery: `${bizName} in ${location}`, maxResultCount: 1 })
    });
    const data = await response.json();
    if (!data.places || data.places.length === 0) return "DATA_UNAVAILABLE";
    
    const biz = data.places[0];
    return `✓ Verified Presence Found. Rating: ${biz.rating || "N/A"} stars from ${biz.userRatingCount || 0} reviews. Website: ${biz.websiteUri || "Missing"}.`;
  } catch (err) { return "DATA_FETCH_FAILED"; }
};

export const performAuditAnalysis = async (bizName: string, location: string) => {
  const mapsData = await fetchMapsData(bizName, location);
  
  const prompt = `
    You are Hunter AI, lead strategist at Smart Marketing. Perform a Strategic Audit for: "${bizName}" in ${location}.
    REAL DATA FROM GOOGLE MAPS: ${mapsData}

    MISSION: Expose pain points in Local SEO, AEO, and AI Visibility.
    RULES: 
    1. DO NOT use asterisks (*) or markdown.
    2. USE [SECTION] for headers.
    3. USE [FIX] for action items.
    4. HIGHLIGHT critical failures using CAPS only.
    5. BE UNSPARING. Focus on the competition eating their lunch.
    6. MANDATORY: End with exactly FINAL_SCORE: [number].
  `;
  return await callHunterAI(prompt);
};
