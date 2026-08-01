import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

// SURGICAL CLEANER: Removes only surrounding quotes and trailing/leading whitespace
const clean = (value?: string): string | undefined => {
  if (!value) return undefined;
  return value.trim().replace(/^["']|["']$/g, "");
};

const apiKey = clean(import.meta.env.VITE_FIREBASE_API_KEY);
const projectId = clean(import.meta.env.VITE_FIREBASE_PROJECT_ID);

if (!apiKey) {
  console.error("CRITICAL: Firebase configuration incomplete.");
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

// APP CHECK: Device attestation — blocks non-browser traffic (curl, bots, scrapers)
const recaptchaKey = clean(import.meta.env.VITE_RECAPTCHA_ENTERPRISE_KEY);

if (recaptchaKey) {
  if (import.meta.env.DEV) {
    (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN =
      (import.meta.env.VITE_APP_CHECK_DEBUG_TOKEN as string) || true;
  }

  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(recaptchaKey),
    isTokenAutoRefreshEnabled: true
  });
} else {
  console.warn("App Check: VITE_RECAPTCHA_ENTERPRISE_KEY not set. App Check disabled.");
}

// EXPORTS FOR THE SYSTEM (Audit and Chatbot rely on these)
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, "us-central1");

console.log("System Initialized for Project:", "***" + firebaseConfig.projectId.slice(-4));
