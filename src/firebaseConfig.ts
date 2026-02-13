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

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";
const PLACES_KEY = import.meta.env.VITE_PLACES_API_KEY || GEMINI_KEY;

export const fetchMapsData = async (bizName: string, location: string) => {
  const URL = "https://places.googleapis.com/v1/places:searchText";
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": PLACES_KEY,
        "X-Goog-FieldMask": "places.displayName.text,places.rating,places.userRatingCount,places.websiteUri,places.formattedAddress"
      },
      body: JSON.stringify({ textQuery: `${bizName} in ${location}`, maxResultCount: 1 })
    });
    const data = await response.json();
    if (!data.places?.length) return { found: false, message: "Handshake refused by Smart Marketing Graph." };
    const biz = data.places[0];
    return {
      found: true,
      name: biz.displayName?.text,
      rating: biz.rating || "N/A",
      reviews: biz.userRatingCount || 0,
      website: biz.websiteUri || "Missing",
      address: biz.formattedAddress
    };
  } catch (err: any) { return { found: false, message: err.message }; }
};

export const callHunterAI = async (prompt: string) => {
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7 } })
    });
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (err) { return "Handshake failed."; }
};

export const performAuditAnalysis = async (bizName: string, location: string) => {
  const mapsData: any = await fetchMapsData(bizName, location);
  const context = mapsData.found 
    ? `✓ Rating: ${mapsData.rating} (${mapsData.reviews} reviews). Website: ${mapsData.website}.`
    : `× INVISIBLE: ${mapsData.message}`;

  const prompt = `You are Hunter AI for Smart Marketing. Perform a Forensic Audit for "${bizName}" in ${location}. 
  DATA: ${context}. 
  MISSION: Expose pain points. NO asterisks. End with FINAL_SCORE: [number].`;
  return await callHunterAI(prompt);
};
