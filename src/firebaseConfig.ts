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

// API KEYS
const PLACES_KEY = import.meta.env.VITE_PLACES_API_KEY;
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Location coordinates for major SA cities (Precision Bias)
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  "cape town": { lat: -33.9249, lng: 18.4241 },
  "johannesburg": { lat: -26.2041, lng: 28.0473 },
  "pretoria": { lat: -25.7479, lng: 28.2293 },
  "durban": { lat: -29.8587, lng: 31.0218 }
};

export const fetchMapsData = async (bizName: string, location: string) => {
  if (!PLACES_KEY) return { error: "CONFIG_ERROR", message: "Places API Key Missing" };

  const normalizedLocation = location.toLowerCase().trim();
  const coords = CITY_COORDS[normalizedLocation] || CITY_COORDS["johannesburg"];

  try {
    const URL = "https://places.googleapis.com/v1/places:searchText";
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": PLACES_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName.text,places.formattedAddress,places.rating,places.userRatingCount,places.websiteUri,places.regularOpeningHours.openNow,places.businessStatus"
      },
      body: JSON.stringify({
        textQuery: `${bizName} in ${location}`,
        locationBias: {
          circle: { center: { latitude: coords.lat, longitude: coords.lng }, radius: 50000.0 }
        },
        maxResultCount: 1
      })
    });

    const data = await response.json();
    if (!data.places || data.places.length === 0) return { error: "NOT_FOUND", message: "No Maps profile detected." };

    const place = data.places[0];
    return {
      found: true,
      name: place.displayName?.text,
      rating: place.rating || "N/A",
      reviews: place.userRatingCount || 0,
      website: place.websiteUri || "MISSING",
      status: place.businessStatus
    };
  } catch (err: any) {
    return { error: "FETCH_ERROR", message: err.message };
  }
};

export const callHunterAI = async (prompt: string) => {
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;
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
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No Response";
  } catch (err) { return "Handshake Interrupted."; }
};

export const performAuditAnalysis = async (bizName: string, location: string) => {
  const mapsData = await fetchMapsData(bizName, location);
  
  let context = "";
  if ("error" in mapsData) {
    context = `MAPS STATUS: UNVERIFIED. Business is invisible on Google Maps.`;
  } else {
    context = `REAL DATA FOUND: Rating: ${mapsData.rating}, Reviews: ${mapsData.reviews}, Website: ${mapsData.website}.`;
  }

  const prompt = `You are Hunter AI, lead strategist at Smart Marketing SA. Perform an unsparing audit for "${bizName}" in ${location}. 
  REAL DATA CONTEXT: ${context}
  
  STRUCTURE:
  [SECTION] THE MAPS VERDICT
  [SECTION] LOCAL SEO FAILURES
  [SECTION] AI VISIBILITY & AEO
  [SECTION] STRATEGIC RECOVERY
  
  MANDATORY: End with FINAL_SCORE: [number]. RULES: No asterisks, No markdown.`;
  
  return await callHunterAI(prompt);
};
