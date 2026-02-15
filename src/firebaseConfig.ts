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

// THE VERIFIED KEY (NO SPACES IN URL)
const KEY = "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";

export const callHunterAI = async (prompt: string) => {
  // RESTORED: Exact URL and model name that worked
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`;
  
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
    
    // THE CLEANER: Ensure no asterisks are returned
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return data.candidates[0].content.parts[0].text.replace(/\*/g, '');
    }
    return "AI_ERROR: Signal empty.";
  } catch (err) {
    return "Handshake failed. Protocol recalibrating.";
  }
};

export const performAuditAnalysis = async (bizName: string, location: string) => {
  const mapsUrl = "https://places.googleapis.com/v1/places:searchText";
  let mapsData = "DATA_UNAVAILABLE";
  try {
    const mRes = await fetch(mapsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": KEY, "X-Goog-FieldMask": "places.displayName.text,places.rating,places.userRatingCount,places.websiteUri" },
      body: JSON.stringify({ textQuery: `${bizName} in ${location}`, maxResultCount: 1 })
    });
    const mData = await mRes.json();
    if (mData.places?.length) {
      const p = mData.places[0];
      mapsData = `Verified: ${p.displayName.text}. Rating: ${p.rating}. Reviews: ${p.userRatingCount}.`;
    }
  } catch (e) { console.warn("Maps Handshake failed."); }

  const prompt = `You are Hunter AI, lead strategist at Smart Marketing. Perform a Strategic Audit for "${bizName}" in ${location}. 
  REAL DATA: ${mapsData}. 
  FOCUS: Pain points in SEO, Social, Footprint, and AEO.
  MANDATORY: End with FINAL_SCORE: [number]. RULES: No asterisks, No markdown. Bold high-impact words with ALL CAPS.`;
  return await callHunterAI(prompt);
};
