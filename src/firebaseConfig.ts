// src/firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { getFunctions, type Functions } from "firebase/functions";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

const clean = (value?: string): string | undefined => {
  if (!value) return undefined;
  const v = value.trim().replace(/^["']|["']$/g, "");
  return v.length === 0 ? undefined : v;
};

const apiKey = clean(import.meta.env.VITE_FIREBASE_API_KEY);
const projectId = clean(import.meta.env.VITE_FIREBASE_PROJECT_ID);

const firebaseConfig: Record<string, string> = {};
if (apiKey) firebaseConfig.apiKey = apiKey;
if (projectId) firebaseConfig.projectId = projectId;
firebaseConfig.authDomain =
  clean(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) ||
  (projectId ? `${projectId}.firebaseapp.com` : "happyhunterdigital.com");
firebaseConfig.storageBucket =
  clean(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) ||
  (projectId ? `${projectId}.appspot.com` : "");
firebaseConfig.messagingSenderId =
  clean(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) || "";
firebaseConfig.appId = clean(import.meta.env.VITE_FIREBASE_APP_ID) || "";

const hasCoreConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

function createSafeAuth(): Auth {
  const noopUnsub = () => {};
  return {
    onAuthStateChanged: (cb: (u: null) => void) => { setTimeout(() => cb(null), 0); return noopUnsub; },
    getRedirectResult: () => Promise.resolve(null),
    signInWithRedirect: () => {},
    signInWithPopup: () => Promise.reject(new Error("Firebase Auth not configured")),
    signOut: () => Promise.resolve(),
    currentUser: null,
  } as unknown as Auth;
}

let app: any = null;
let auth: Auth = createSafeAuth();
let db: Firestore | null = null;
let functions: Functions | null = null;

if (hasCoreConfig) {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    const recaptchaKey = clean(import.meta.env.VITE_RECAPTCHA_ENTERPRISE_KEY);
    if (recaptchaKey) {
      try {
        if (import.meta.env.DEV) (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = (import.meta.env.VITE_APP_CHECK_DEBUG_TOKEN as string) || true;
        initializeAppCheck(app, { provider: new ReCaptchaEnterpriseProvider(recaptchaKey), isTokenAutoRefreshEnabled: true });
      } catch (e) { console.warn("[Firebase] App Check init failed:", e); }
    }
    try { auth = getAuth(app); } catch (e) { console.warn("[Firebase] Auth init failed:", e); }
    try { db = getFirestore(app); } catch (e) { console.warn("[Firebase] Firestore init failed:", e); }
    try { functions = getFunctions(app, "us-central1"); } catch (e) { console.warn("[Firebase] Functions init failed:", e); }
  } catch (e) { console.warn("[Firebase] App init failed:", e); }
} else {
  console.warn("[Firebase] Missing env vars — static mode.");
}

export const isFirebaseConfigured = hasCoreConfig;
export { auth, db, functions };
