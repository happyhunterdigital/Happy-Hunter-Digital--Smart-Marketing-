import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Replace PLACEHOLDERS with your config variables from .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "happy-hunter-digital.firebaseapp.com",
  projectId: "happy-hunter-digital",
  storageBucket: "happy-hunter-digital.appspot.com",
  messagingSenderId: "PLACEHOLDER",
  appId: "PLACEHOLDER"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app); 
export const auth = getAuth(app); 
// We are removing the old model export because the AI is managed in geminiService.ts now
