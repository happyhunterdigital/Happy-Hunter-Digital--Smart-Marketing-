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

const PLACES_API_KEY = import.meta.env.VITE_PLACES_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  "cape town": { lat: -33.9249, lng: 18.4241 },
  "johannesburg": { lat: -26.2041, lng: 28.0473 },
  "pretoria": { lat: -25.7479, lng: 28.2293 },
  "durban": { lat: -29.8587, lng: 31.0218 }
};

export const fetchMapsData = async (bizName: string, location: string) => {
  if (!PLACES_API_KEY) return { error: "CONFIG_ERROR", message: "Places Key Missing" };
  const coords = CITY_COORDS[location.toLowerCase().trim()] || CITY_COORDS["johannesburg"];

  try {
    const URL = "https://places.googleapis.com/v1/places:searchText";
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": PLACES_API_KEY,
        "X-Goog-FieldMask": "places.displayName.text,places.formattedAddress,places.rating,places.userRatingCount,places.websiteUri,places.regularOpeningHours.openNow,places.businessStatus"
      },
      body: JSON.stringify({
        textQuery: `${bizName} in ${location}`,
        locationBias: { circle: { center: { latitude: coords.lat, longitude: coords.lng }, radius: 50000.0 } },
        maxResultCount: 1
      })
    });

    const data = await response.json();
    if (!data.places?.length) return { error: "NOT_FOUND", message: "Invisible on Google Maps." };

    const place = data.places[0];
    return {
      found: true,
      name: place.displayName?.text,
      rating: place.rating || "N/A",
      reviews: place.userRatingCount || 0,
      website: place.websiteUri || "MISSING",
      status: place.businessStatus
    };
  } catch (err: any) { return { error: "FETCH_ERROR", message: err.message }; }
};

export const callHunterAI = async (prompt: string) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7 } })
  });
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Handshake failed.";
};

export const performAuditAnalysis = async (bizName: string, location: string) => {
  const mapsData: any = await fetchMapsData(bizName, location);
  const dataContext = mapsData.found 
    ? `✓ Rating: ${mapsData.rating} (${mapsData.reviews} reviews). ✓ Website: ${mapsData.website}.`
    : `CRITICAL: Business is invisible on Google Maps. Error: ${mapsData.message}`;

  const prompt = `You are Hunter AI for Smart Marketing. Perform a Forensic Audit for "${bizName}" in ${location}. 
  REAL DATA: ${dataContext}. 
  STRUCTURE: [SECTION] THE MAPS VERDICT, [SECTION] LOCAL SEO FAILURES, [SECTION] AI VISIBILITY, [SECTION] STRATEGIC RECOVERY.
  RULES: End with FINAL_SCORE: [number]. No asterisks.`;
  return await callHunterAI(prompt);
};
