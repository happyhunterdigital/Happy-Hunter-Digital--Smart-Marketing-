import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. ROBUST CONFIG LOAD
// Tries to parse the GitHub Secret JSON first, falls back to manual env vars
let firebaseConfig;
try {
  const rawConfig = import.meta.env.VITE_FIREBASE_CONFIG;
  if (rawConfig && rawConfig.startsWith('{')) {
    firebaseConfig = JSON.parse(rawConfig);
  } else {
    throw new Error("Using Manual Config");
  }
} catch (e) {
  firebaseConfig = {
    apiKey: "AIzaSyBQvZ2-w9DrJWQEgy4IarClycARAvMJIAc", // Hardcoded safe for client-side
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

// 3. THE MASTER AI HANDSHAKE
// This function handles the connection to Gemini securely from the client
export const callHunterAI = async (prompt: string, isJsonMode = false) => {
  const RAW_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  // Debug Log (Visible in Console F12)
  console.log("Hunter AI Signal Check:", RAW_KEY ? "KEY PRESENT" : "KEY MISSING");

  if (!RAW_KEY) {
    return isJsonMode ? 
      JSON.stringify({ error: "MISSING_KEY", analysis: [] }) : 
      "SYSTEM ALERT: API Key lost in deployment. Check GitHub Secrets.";
  }

  try {
    const genAI = new GoogleGenerativeAI(RAW_KEY);
    // Using 1.5 Flash as it is the most stable for Client-Side calls currently
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: isJsonMode ? "application/json" : "text/plain"
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("HANDSHAKE FAILED:", error);
    
    // Friendly error for the UI
    if (error.message.includes("403")) return "ACCESS DENIED: Check Google Cloud API Restrictions.";
    if (error.message.includes("429")) return "TRAFFIC OVERLOAD: Too many requests. Try again.";
    
    return "SIGNAL LOST: connection failed. Please retry.";
  }
};

export { db, auth };
