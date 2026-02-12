import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // HANDSHAKE FIX

// Firebase config
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
export const auth = getAuth(app); // EXPORTED FOR ADMIN OPS

// API Keys
const PLACES_KEY = "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";
const GEMINI_KEY = "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";

export const callHunterAI = async (prompt: string) => {
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
  
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 3000 }
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      return `AI_ERROR: ${error.error?.message || response.statusText}`;
    }
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "AI_ERROR: Empty response";
  } catch (err: any) {
    return `HANDSHAKE_ERROR: ${err.message}`;
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
        "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri,places.formattedAddress,places.businessStatus,places.primaryType"
      },
      body: JSON.stringify({ 
        textQuery: `${bizName} ${location}`,
        maxResultCount: 1,
        languageCode: "en"
      })
    });

    if (!response.ok) return { error: true, message: "API_REJECTION" };

    const data = await response.json();
    if (!data.places || data.places.length === 0) return { error: true, message: "ENTITY_NOT_FOUND" };
    
    const biz = data.places[0];
    return {
      found: true,
      name: biz.displayName?.text || bizName,
      rating: biz.rating || null,
      reviewCount: biz.userRatingCount || 0,
      website: biz.websiteUri || null,
      address: biz.formattedAddress || location,
      status: biz.businessStatus || "UNKNOWN",
      category: biz.primaryType || "Unknown"
    };
    
  } catch (err: any) {
    return { error: true, message: err.message };
  }
};

export const performAuditAnalysis = async (bizName: string, location: string) => {
  const mapsData: any = await fetchMapsData(bizName, location);
  
  let dataContext = "";
  if (mapsData.found) {
    dataContext = `✓ VERIFIED PROFILE FOUND: Rating ${mapsData.rating}/5 from ${mapsData.reviewCount} reviews. Website: ${mapsData.website || "MISSING"}.`;
  } else {
    dataContext = `× CRITICAL FAILURE: Business is INVISIBLE to the Knowledge Graph. Data fetch returned ${mapsData.message}.`;
  }

  const prompt = `You are Hunter AI, lead strategist at Smart Marketing. Perform a Forensic Strategic Audit for "${bizName}" in ${location}.
  REAL DATA CONTEXT: ${dataContext}
  MISSION: Expose pain points and gaps. 
  RULES: Use [SECTION] for headers, [FIX] for action items. No asterisks. No markdown.
  MANDATORY: End with exactly FINAL_SCORE: [number between 0 and 100].`;

  return await callHunterAI(prompt);
};
