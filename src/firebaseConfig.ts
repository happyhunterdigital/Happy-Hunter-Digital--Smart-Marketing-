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

const KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";

// 1. THE GOOGLE MAPS FORENSIC HANDSHAKE
export const fetchMapsData = async (bizName: string, location: string) => {
  const URL = `https://places.googleapis.com/v1/places:searchText`;
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': KEY,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.websiteUri,places.regularOpeningHours'
      },
      body: JSON.stringify({ textQuery: `${bizName} in ${location}` })
    });
    const data = await response.json();
    if (!data.places || data.places.length === 0) return "DATA_UNAVAILABLE: Entity not found on Maps.";
    const biz = data.places[0];
    return `
      REAL DATA FOUND:
      - Rating: ${biz.rating || "None"}
      - Reviews: ${biz.userRatingCount || 0}
      - Website Node: ${biz.websiteUri ? "Found" : "Missing"}
      - Current Status: ${biz.regularOpeningHours?.openNow ? "Verified Open" : "Closed/Unverified"}
    `;
  } catch (err) { return "MAPS_HANDSHAKE_ERROR"; }
};

// 2. THE UNIVERSAL AI CALLER
export const callHunterAI = async (prompt: string) => {
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`;
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 4000 }
      })
    });
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (err) { return "Handshake interrupted."; }
};

// 3. THE UNSPARING AUDIT LOGIC
export const performAuditAnalysis = async (bizName: string, location: string) => {
  const realData = await fetchMapsData(bizName, location);
  const prompt = `You are Hunter AI, lead strategist at Smart Marketing. 
  AUDIT TARGET: "${bizName}" in ${location}. 
  REAL GOOGLE MAPS INTEL: ${realData}.
  
  MISSION: Provide an unsparing audit focused ONLY on PAIN POINTS and LACKING elements.
  
  STRUCTURE:
  [SECTION] LOCAL SEO & GMB FAILURES (Compare their real rating/reviews to market standards)
  [SECTION] SOCIAL MEDIA VOID
  [SECTION] DIGITAL FOOTPRINT GAPS
  [SECTION] AI VISIBILITY & AEO CRISIS (Explain why AI can't trust/recommend them)
  [SECTION] STRATEGIC VERDICT (Estimated Monthly Revenue Loss)
  
  MANDATORY: End with FINAL_SCORE: [number].
  RULES: Use [H] for headers, [FIX] for actions. No asterisks. No robotic talk.`;
  return await callHunterAI(prompt);
};
