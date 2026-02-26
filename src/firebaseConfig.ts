import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

// AGGRESSIVE SECRET SANITIZER: Destroys hidden spaces, quotes, and newlines
const scrub = (key?: string) => (key || "").replace(/['"\s\n\r]/g, "");

const firebaseConfig = {
  apiKey: scrub(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: scrub(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: scrub(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: scrub(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: scrub(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: scrub(import.meta.env.VITE_FIREBASE_APP_ID)
};

const app = initializeApp(firebaseConfig);

// EXPORTS FOR THE SYSTEM
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, "us-central1");
