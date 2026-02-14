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

// API Keys from environment
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";
const PLACES_KEY = import.meta.env.VITE_PLACES_API_KEY || "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";

// 1. SMART MARKETING GRAPH (GOOGLE MAPS)
export const fetchMapsData = async (bizName: string, location: string) => {
  const URL = "https://places.googleapis.com/v1/places:searchText";
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": PLACES_KEY,
        "X-Goog-FieldMask": "places.displayName.text,places.formattedAddress,places.rating,places.userRatingCount,places.websiteUri,places.businessStatus"
      },
      body: JSON.stringify({
        textQuery: `${bizName} in ${location}`,
        maxResultCount: 1
      })
    });

    const data = await response.json();
    if (!data.places || data.places.length === 0) return { found: false, message: "INVISIBLE" };
    
    const biz = data.places[0];
    return {
      found: true,
      name: biz.displayName?.text,
      rating: biz.rating || "N/A",
      reviews: biz.userRatingCount || 0,
      website: biz.websiteUri || "MISSING"
    };
  } catch (err) {
    return { found: false, message: "NETWORK_ERROR" };
  }
};

// 2. THE STABLE AI CALLER (1.5-FLASH)
export const callHunterAI = async (prompt: string): Promise<string> => {
  // SWITCHED TO 1.5-FLASH FOR QUOTA STABILITY
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2500 }
      })
    });

    const data = await response.json();

    if (data.error) {
      if (data.error.code === 429) {
        return "ERROR: Our AI strategists are currently over-capacity. Please WhatsApp Thabo directly or try again in 60 seconds.";
      }
      return `SYSTEM_ERROR: ${data.error.message}`;
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Handshake failed.";
  } catch (err: any) {
    return "CONNECTION_ERROR: Signal lost.";
  }
};

// 3. THE FORENSIC AUDIT ANALYSIS
export const performAuditAnalysis = async (bizName: string, location: string): Promise<string> => {
  const mapsData = await fetchMapsData(bizName, location);
  
  let context = "";
  if (mapsData.found) {
    context = `✓ VERIFIED ENTITY FOUND: Rating ${mapsData.rating}, Reviews ${mapsData.reviews}, Website: ${mapsData.website}.`;
  } else {
    context = `× INVISIBLE ENTITY: Business is not verified in the Google Knowledge Graph.`;
  }

  const prompt = `You are Hunter AI, lead digital strategist for Smart Marketing South Africa. 
  Perform an unsparing strategic audit for "${bizName}" in ${location}. 
  REAL DATA: ${context}.
  
  MISSION: Expose pain points. NO asterisks. 
  MANDATORY: End with exactly FINAL_SCORE: [number 0-100].`;

  return await callHunterAI(prompt);
};
