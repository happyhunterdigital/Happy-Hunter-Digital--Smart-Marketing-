import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

// SURGICAL CLEANER: Removes only surrounding quotes and trailing/leading whitespace
const clean = (value?: string): string | undefined => {
  if (!value) return undefined;
  return value.trim().replace(/^["']|["']$/g, "");
};

const apiKey = clean(import.meta.env.VITE_FIREBASE_API_KEY);
const projectId = clean(import.meta.env.VITE_FIREBASE_PROJECT_ID);

// FAIL-SAFE: If the API key is missing from GitHub Secrets, warn the console
if (!apiKey) {
  console.error("CRITICAL: VITE_FIREBASE_API_KEY is missing. Handshake will fail.");
}

const firebaseConfig = {
  apiKey: apiKey || "",
  authDomain: clean(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) || `${projectId}.firebaseapp.com`,
  projectId: projectId || "",
  storageBucket: clean(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) || `${projectId}.firebasestorage.app`,
  messagingSenderId: clean(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) || "",
  appId: clean(import.meta.env.VITE_FIREBASE_APP_ID) || ""
};

const app = initializeApp(firebaseConfig);

// EXPORTS FOR THE SYSTEM (Audit and Chatbot rely on these)
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, "us-central1");

console.log("System Initialized for Project:", firebaseConfig.projectId);
