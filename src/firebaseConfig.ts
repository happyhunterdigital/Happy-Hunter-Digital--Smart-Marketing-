// src/firebaseConfig.ts
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

// API KEYS - Check if they exist
const PLACES_KEY = import.meta.env.VITE_PLACES_API_KEY;
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

console.log("🔑 Environment Check:", {
  placesKeyExists: !!PLACES_KEY,
  placesKeyFirst10: PLACES_KEY ? PLACES_KEY.substring(0, 10) + "..." : "MISSING",
  geminiKeyExists: !!GEMINI_KEY,
  nodeEnv: import.meta.env.MODE
});

// Location coordinates for major SA cities
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  "cape town": { lat: -33.9249, lng: 18.4241 },
  "johannesburg": { lat: -26.2041, lng: 28.0473 },
  "pretoria": { lat: -25.7479, lng: 28.2293 },
  "durban": { lat: -29.8587, lng: 31.0218 }
};

export const fetchMapsData = async (bizName: string, location: string) => {
  console.log("🔍 fetchMapsData called:", { bizName, location });
  
  if (!PLACES_KEY) {
    console.error("❌ PLACES_KEY is undefined - check .env file");
    return { error: "CONFIG_ERROR", message: "VITE_PLACES_API_KEY not found in environment" };
  }

  const normalizedLocation = location.toLowerCase().trim();
  const coords = CITY_COORDS[normalizedLocation] || CITY_COORDS["johannesburg"];
  
  try {
    // NO TRAILING SPACE IN URL!
    const URL = "https://places.googleapis.com/v1/places:searchText";
    
    console.log("🌐 Making request to Places API...");
    
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
          circle: { 
            center: { latitude: coords.lat, longitude: coords.lng }, 
            radius: 50000.0 
          }
        },
        maxResultCount: 1
      })
    });

    console.log("📥 Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ HTTP Error:", errorText);
      return { error: "API_ERROR", message: `HTTP ${response.status}: ${errorText}` };
    }

    const data = await response.json();
    console.log("✅ Places API response:", data);

    if (!data.places || data.places.length === 0) {
      return { error: "NOT_FOUND", message: "No Maps profile detected." };
    }

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
    console.error("💥 Exception:", err);
    return { error: "FETCH_ERROR", message: err.message };
  }
};

export const callHunterAI = async (prompt: string) => {
  if (!GEMINI_KEY) {
    throw new Error("GEMINI_KEY missing");
  }

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
  } catch (err) { 
    return "Handshake Interrupted."; 
  }
};

export const performAuditAnalysis = async (bizName: string, location: string) => {
  console.log("🚀 performAuditAnalysis started");
  
  const mapsData = await fetchMapsData(bizName, location);
  console.log("📊 Maps data result:", mapsData);
  
  let context = "";
  if ("error" in mapsData) {
    context = `MAPS STATUS: ${mapsData.error}. ${mapsData.message}`;
  } else {
    context = `REAL DATA: Rating ${mapsData.rating}, Reviews ${mapsData.reviews}, Website ${mapsData.website}`;
  }

  const prompt = `You are Hunter AI, lead strategist at Smart Marketing SA. 
Audit "${bizName}" in ${location}.
${context}

Structure:
[SECTION] THE MAPS VERDICT
[SECTION] LOCAL SEO FAILURES  
[SECTION] AI VISIBILITY
[SECTION] STRATEGIC RECOVERY

End with FINAL_SCORE: [0-100]. No asterisks.`;

  return await callHunterAI(prompt);
};
