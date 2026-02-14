import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

// 1. INITIALIZE THE LATEST AI ENGINE
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";
const genAI = new GoogleGenerativeAI(GEMINI_KEY);

// 2. THE UNIVERSAL AI CALLER (SDK VERSION)
export const callHunterAI = async (prompt: string): Promise<string> => {
  try {
    // Using 'gemini-flash-latest' as per your recommendation
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      generationConfig: { temperature: 0.7, maxOutputTokens: 3000 }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (err: any) {
    if (err.message?.includes("429")) {
      return "ERROR: Our strategic graph is currently under high load. Please try again in 30 seconds or WhatsApp Thabo directly.";
    }
    return "Handshake failed. Protocol recalibrating.";
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
    if (!data.places || data.places.length === 0) return "DATA_UNAVAILABLE";
    const biz = data.places[0];
    return `✓ Verified Presence Found. Rating: ${biz.rating || "N/A"} stars. Reviews: ${biz.userRatingCount || 0}.`;
  } catch (err) { return "GRAPH_CONNECTION_ERROR"; }
};

// 4. THE UNSPARING FORENSIC AUDIT
export const performAuditAnalysis = async (bizName: string, location: string): Promise<string> => {
  const mapsData = await fetchMapsData(bizName, location);
  const prompt = `
    You are Hunter AI for Smart Marketing. Perform a Strategic Audit for: "${bizName}" in ${location}.
    REAL DATA FROM SMART MARKETING GRAPH: ${mapsData}

    MISSION: Expose pain points and gaps. 
    RULES: No asterisks. [SECTION] for headers. [FIX] for actions.
    MANDATORY: End with exactly FINAL_SCORE: [number 0-100].
  `;
  return await callHunterAI(prompt);
};
