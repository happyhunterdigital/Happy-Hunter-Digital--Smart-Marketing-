import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";
import { GoogleGenerativeAI } from "@google/generative-ai";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

// EXPORTS FOR THE SYSTEM
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, "us-central1");

// SECRET SANITIZER
const scrub = (key: string) => (key || "").replace(/['"\s]/g, "");

export const GEMINI_KEY = scrub(import.meta.env.VITE_GEMINI_API_KEY);
export const PLACES_KEY = scrub(import.meta.env.VITE_PLACES_API_KEY);

// INITIALIZE GEMINI FLASH LATEST (HARD-WIRED)
const genAI = new GoogleGenerativeAI(GEMINI_KEY);
export const hunterModel = genAI.getGenerativeModel({ 
  model: "gemini-flash-latest" 
});
