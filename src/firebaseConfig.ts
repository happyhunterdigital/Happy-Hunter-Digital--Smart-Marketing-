import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// SURGICAL CLEANER: Removes only surrounding quotes and trailing/leading whitespace
const clean = (value?: string): string | undefined => {
  if (!value) return undefined;
  return value.trim().replace(/^["']|["']$/g, "");
};

const apiKey = clean(import.meta.env.VITE_FIREBASE_API_KEY);
const projectId = clean(import.meta.env.VITE_FIREBASE_PROJECT_ID);

if (!apiKey) {
  console.error("CRITICAL: Firebase API Key is missing. Handshake will fail.");
}

const firebaseConfig = {
  apiKey: apiKey || "",
  // Use the custom domain as the authDomain to fix mobile 'sessionStorage' partitioning errors
  authDomain: clean(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) || "happyhunterdigital.com",
  projectId: projectId || "",
  storageBucket: clean(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) || `${projectId}.firebasestorage.app`,
  messagingSenderId: clean(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) || "",
  appId: clean(import.meta.env.VITE_FIREBASE_APP_ID) || ""
};

const app = initializeApp(firebaseConfig);

// SECURITY: Required for performAudit() which now has enforceAppCheck: true.
// Without this, all calls to that function will be rejected. Requires a
// reCAPTCHA v3 site key registered in Firebase Console > App Check.
const recaptchaSiteKey = clean(import.meta.env.VITE_RECAPTCHA_SITE_KEY);
if (!recaptchaSiteKey) {
  console.error("CRITICAL: VITE_RECAPTCHA_SITE_KEY is missing. App Check will not initialize; calls to protected functions will fail.");
} else {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(recaptchaSiteKey),
    isTokenAutoRefreshEnabled: true
  });
}

// EXPORTS FOR THE SYSTEM (Audit and Chatbot rely on these)
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, "us-central1");

console.log("System Initialized for Project:", firebaseConfig.projectId);
