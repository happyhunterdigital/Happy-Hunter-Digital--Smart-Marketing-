import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. SAFETY CONFIG LOADING
// This prevents the "JSON Parse" error if the secret is missing during build
let firebaseConfig;
try {
  // Tries to load from GitHub Secret first
  const rawConfig = import.meta.env.VITE_FIREBASE_CONFIG;
  if (rawConfig && rawConfig.startsWith('{')) {
    firebaseConfig = JSON.parse(rawConfig);
  } else {
    throw new Error("Using Manual Config");
  }
} catch (e) {
  // FALLBACK: Hardcoded config (Safe for public client-side apps)
  firebaseConfig = {
    apiKey: "AIzaSyBQvZ2-w9DrJWQEgy4IarClycARAvMJIAc",
    authDomain: "happyhunterdigital-17480.firebaseapp.com",
    projectId: "happyhunterdigital-17480",
    storageBucket: "happyhunterdigital-17480.firebasestorage.app",
    messagingSenderId: "449102421348",
    appId: "1:449102421348:web:d61e0c209b93bf282fae71",
    measurementId: "G-PS04HKGEXF"
  };
}

// 2. INITIALIZE FIREBASE
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 3. THE ROBUST AI CALLER (CLIENT-SIDE)
export const callHunterAI = async (prompt: string, isJsonMode = false) => {
  // debug: Check if key exists in the build
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!API_KEY) {
    console.error("CRITICAL: VITE_GEMINI_API_KEY is missing.");
    return isJsonMode ? 
      JSON.stringify({ score: 0, analysis: [{ heading: "Config Error", content: "API Key Missing", requirement: "Check GitHub Secrets" }] }) 
      : "System Error: API Key not found.";
  }

  try {
    // Initialize Gemini Client
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Use 'gemini-1.5-flash' for speed and stability
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        // Force JSON if requested (Crucial for the Audit)
        responseMimeType: isJsonMode ? "application/json" : "text/plain" 
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("HUNTER AI ERROR:", error);
    // Return a safe fallback string so the UI doesn't crash
    return isJsonMode ? 
      JSON.stringify({ score: 0, analysis: [] }) 
      : "Hunter AI is currently recalibrating. Please try again in 10 seconds.";
  }
};

export { db, auth };
