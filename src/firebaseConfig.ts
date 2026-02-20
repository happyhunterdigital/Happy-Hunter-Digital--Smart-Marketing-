import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
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
export const db = getFirestore(app);

// SECRET SANITIZER: Ensures keys are pure strings
const scrub = (key: string) => (key || "").replace(/['"\s]/g, "");

const RAW_GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const RAW_PLACES_KEY = import.meta.env.VITE_PLACES_API_KEY;

export const GEMINI_KEY = scrub(RAW_GEMINI_KEY);
export const PLACES_KEY = scrub(RAW_PLACES_KEY);

// INITIALIZE AI BRAIN
export const genAI = new GoogleGenerativeAI(GEMINI_KEY);
export const hunterModel = genAI.getGenerativeModel({ 
  model: "gemini-flash-latest" 
});
