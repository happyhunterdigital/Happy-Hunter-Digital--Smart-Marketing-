// src/firebaseConfig.ts
// ---------------------------------------------------------------
// SAFETY RULE: This module must NEVER throw.
// If Firebase config is missing or invalid, we degrade to safe
// stubs so React can still mount and the site keeps its styling.
// ---------------------------------------------------------------

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

// Build a config object only with values that actually exist.
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

// Treat the config as usable only when both apiKey and projectId are present.
const hasCoreConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

// --- Safe stubs for when config is missing ----------------------
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

const safeFirestoreReject = (): never => {
  throw new Error("Firestore not configured");
};

function createSafeFirestore(): Firestore {
  // Safe proxy — returns a thenable-noop for any call so callers can try/catch.
  const noop = () => Promise.reject(new Error("Firestore not configured"));
  const handler: ProxyHandler<Firestore> = {
    get(_target, prop) {
      if (typeof prop === "string" && (prop === "app" || prop === "type" || prop === "_delegate")) return undefined;
      if (prop === Symbol.toPrimitive || prop === Symbol.toStringTag) return "Firestore";
      return noop;
    },
  };
  return new Proxy({} as Firestore, handler) as Firestore;
}

function createSafeFunctions(): Functions {
  return {} as Functions;
}

// --- Real objects ----------------------------------------------
let app: any = null;
let auth: Auth | null = null;
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
      } catch (e) {
        console.warn("[Firebase] App Check init failed:", e);
      }
    }
    try { auth = getAuth(app); } catch (e) { console.warn("[Firebase] Auth init failed:", e); }
    try { db = getFirestore(app); } catch (e) { console.warn("[Firebase] Firestore init failed:", e); }
    try { functions = getFunctions(app, "us-central1"); } catch (e) { console.warn("[Firebase] Functions init failed:", e); }
  } catch (e) {
    console.warn("[Firebase] App init failed:", e);
    auth = null;
    db = null;
    functions = null;
  }
} else {
  console.warn("[Firebase] Missing client credentials — running in static mode.");
}

// ---------------------------------------------------------------
// Export singletons. NEVER null — always safe to import everywhere.
// ---------------------------------------------------------------
export const isFirebaseConfigured = hasCoreConfig;

// auth: always a real Auth OR a safe stub
const safeAuth: Auth = auth ?? createSafeAuth();
export { safeAuth as auth };

// db: real Firestore OR a rejecting proxy (so callers get a typed Firestore, never null)
const safeDb: Firestore = db ?? createSafeFirestore();
export { safeDb as db };

// functions: real Functions OR empty object stub
const safeFunctions: Functions = functions ?? createSafeFunctions();
export { safeFunctions as functions };

if (hasCoreConfig && firebaseConfig.projectId && firebaseConfig.apiKey) {
  console.log(`[Firebase] Initialised for project ***${firebaseConfig.projectId.slice(-4)} (key ${firebaseConfig.apiKey.slice(0, 6)}…${firebaseConfig.apiKey.slice(-4)})`);
}
