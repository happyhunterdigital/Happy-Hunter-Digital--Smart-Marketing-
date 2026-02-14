import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { GoogleGenerativeAI } from "@google/generative-ai"; // OFFICIAL SDK

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

// 1. INITIALIZE THE SDK BRAIN
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";
const genAI = new GoogleGenerativeAI(GEMINI_KEY);

// 2. THE UNIVERSAL AI CALLER (SDK VERSION)
export const callHunterAI = async (prompt: string): Promise<string> => {
  try {
    // We use 1.5-flash because it has the highest free-tier quota
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { temperature: 0.7, maxOutputTokens: 2000 }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) throw new Error("Empty Response");
    return text;

  } catch (err: any) {
    if (err.message?.includes("429")) {
      return "ERROR: The Smart Marketing Graph is currently processing a high volume of SME data. Please try again in 30 seconds or WhatsApp Thabo directly.";
    }
    return `CONNECTION_ERROR: Protocol handshake refused. (${err.message})`;
  }
};

// 3. SMART MARKETING GRAPH (GOOGLE MAPS)
export const fetchMapsData = async (bizName: string, location: string) => {
  const PLACES_KEY = import.meta.env.VITE_PLACES_API_KEY || GEMINI_KEY;
  const URL = "https://places.googleapis.com/v1/places:searchText";
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": PLACES_KEY,
        "X-Goog-FieldMask": "places.displayName.text,places.rating,places.userRatingCount,places.websiteUri"
      },
      body: JSON.stringify({ textQuery: `${bizName} in ${location}`, maxResultCount: 1 })
    });
    const data = await response.json();
    if (!data.places?.length) return "DATA_UNAVAILABLE";
    const biz = data.places[0];
    return `Verified Rating: ${biz.rating || "N/A"} (${biz.userRatingCount || 0} reviews).`;
  } catch (err) { return "DATA_FETCH_FAILED"; }
};

// 4. THE FORENSIC AUDIT
export const performAuditAnalysis = async (bizName: string, location: string): Promise<string> => {
  const mapsData = await fetchMapsData(bizName, location);
  const prompt = `You are Hunter AI, lead digital strategist at Smart Marketing SA. Perform a forensic audit for "${bizName}" in ${location}.
  REAL MAPS DATA: ${mapsData}
  MISSION: Expose gaps in Local SEO, Social signals, and AI visibility. NO asterisks. End with FINAL_SCORE: [number].`;
  return await callHunterAI(prompt);
};
