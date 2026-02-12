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

// API KEYS (Prioritizing the high-res keys from your Secrets)
const PLACES_KEY = import.meta.env.VITE_PLACES_API_KEY || "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";

export const fetchMapsData = async (bizName: string, location: string) => {
  const URL = "https://places.googleapis.com/v1/places:searchText";
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": PLACES_KEY,
        // We use the exact field mask required by the v1 API
        "X-Goog-FieldMask": "places.displayName.text,places.formattedAddress,places.rating,places.userRatingCount,places.websiteUri,places.businessStatus"
      },
      body: JSON.stringify({
        textQuery: `${bizName} in ${location}`,
        maxResultCount: 1
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { error: true, message: errorText };
    }

    const data = await response.json();
    if (!data.places || data.places.length === 0) {
      return { error: true, message: "ENTITY_NOT_FOUND_IN_GRAPH" };
    }

    const biz = data.places[0];
    return {
      found: true,
      name: biz.displayName?.text,
      rating: biz.rating || "N/A",
      reviews: biz.userRatingCount || 0,
      website: biz.websiteUri || "MISSING",
      address: biz.formattedAddress
    };
  } catch (err: any) {
    return { error: true, message: err.message };
  }
};

export const callHunterAI = async (prompt: string) => {
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
    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    return "HANDSHAKE_ERROR: Brain connection interrupted.";
  }
};

export const performAuditAnalysis = async (bizName: string, location: string) => {
  const mapsData: any = await fetchMapsData(bizName, location);
  
  // LOGIC: If maps fails, the AI should know and analyze the invisibility.
  // If maps succeeds, the AI analyzes the real stars/reviews.
  const dataContext = mapsData.found 
    ? `REAL DATA RETRIEVED: Business is verified. Rating: ${mapsData.rating}, Reviews: ${mapsData.reviews}, Website: ${mapsData.website}. Address: ${mapsData.address}.`
    : `MAPS DATA UNAVAILABLE: ${mapsData.message}. Business is currently invisible or unverified in the Google Maps Knowledge Graph.`;

  const prompt = `You are Hunter AI for Smart Marketing. Perform a Forensic Audit for "${bizName}" in ${location}. 
  DATA CONTEXT: ${dataContext}
  
  MISSION: Expose pain points and gaps. 
  IF DATA IS FOUND: Critique the rating/reviews/profile depth.
  IF DATA IS MISSING: Explain the "Digital Black Hole" and why AI cannot recommend them.
  
  MANDATORY: End with FINAL_SCORE: [number]. RULES: No asterisks, No markdown.`;
  
  return await callHunterAI(prompt);
};
