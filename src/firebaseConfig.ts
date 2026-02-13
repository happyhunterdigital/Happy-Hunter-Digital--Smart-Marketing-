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

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const PLACES_KEY = import.meta.env.VITE_PLACES_API_KEY;

// 1. SMART MARKETING GRAPH: Direct Fetch with CORS Proxy
export const fetchMapsData = async (bizName: string, location: string) => {
  const query = encodeURIComponent(`${bizName} in ${location}`);
  const URL = `https://places.googleapis.com/v1/places:searchText`;
  
  // We use a CORS proxy to prevent "Failed to fetch" in the browser
  const PROXY_URL = `https://api.allorigins.win/get?url=${encodeURIComponent(URL)}`;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": PLACES_KEY,
        "X-Goog-FieldMask": "places.displayName.text,places.rating,places.userRatingCount,places.websiteUri"
      },
      body: JSON.stringify({ textQuery: `${bizName} ${location}`, maxResultCount: 1 })
    });

    const data = await response.json();
    if (!data.places?.length) return { found: false, message: "INVISIBLE_IN_GRAPH" };

    const biz = data.places[0];
    return {
      found: true,
      name: biz.displayName?.text,
      rating: biz.rating || "N/A",
      reviews: biz.userRatingCount || 0,
      website: biz.websiteUri || "MISSING"
    };
  } catch (err) {
    // If the direct call fails (CORS), we tell the AI to assume "Ghost Status"
    return { found: false, message: "HANDSHAKE_BLOCKED" };
  }
};

// 2. THE UNIVERSAL AI CALLER
export const callHunterAI = async (prompt: string) => {
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
  } catch (err) {
    return "Handshake failed. Protocol offline.";
  }
};

export const performAuditAnalysis = async (bizName: string, location: string) => {
  const mapsData: any = await fetchMapsData(bizName, location);
  
  const context = mapsData.found 
    ? `✓ VERIFIED DATA: Rating ${mapsData.rating}, ${mapsData.reviews} reviews.`
    : `× INVISIBLE: Business not found in local Knowledge Graph nodes.`;

  const prompt = `You are Hunter AI for Smart Marketing. Perform an unsparing audit for "${bizName}" in ${location}. DATA: ${context}. MISSION: Expose gaps. RULES: End with FINAL_SCORE: [number]. No asterisks.`;
  return await callHunterAI(prompt);
};
