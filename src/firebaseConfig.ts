// src/firebaseConfig.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFunctions, Functions } from "firebase/functions";

// Safe env var getter
const getEnvVar = (name: string): string => {
  const value = import.meta.env[name];
  if (!value || value === 'REPLACE_WITH_SECRET') {
    console.warn(`⚠️ ${name} not set`);
    return '';
  }
  return value;
};

const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID'),
  measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID'),
};

// Check if config is valid
const isValidConfig = () => {
  return firebaseConfig.apiKey && 
         firebaseConfig.projectId && 
         firebaseConfig.appId;
};

let app: FirebaseApp;
let db: Firestore | null = null;
let auth: Auth | null = null;
let analytics: Analytics | null = null;
let functions: Functions | null = null;

// Initialize with error handling
try {
  if (isValidConfig()) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
    functions = getFunctions(app, 'africa-south1');
    
    if (import.meta.env.PROD && firebaseConfig.measurementId) {
      try {
        analytics = getAnalytics(app);
      } catch (e) {
        console.log('Analytics skipped');
      }
    }
    console.log('✅ Firebase initialized');
  } else {
    console.warn('❌ Invalid Firebase config - running in demo mode');
    // Create dummy app to prevent crashes
    app = initializeApp({ 
      projectId: 'demo-project', 
      apiKey: 'demo-key',
      appId: 'demo-app'
    }, 'demo');
  }
} catch (error) {
  console.error('Firebase init error:', error);
  app = initializeApp({ 
    projectId: 'error-project', 
    apiKey: 'error-key',
    appId: 'error-app'
  }, 'error');
}

export { app, db, auth, analytics, functions };

export const getFirebaseStatus = () => ({
  initialized: isValidConfig(),
  database: !!db,
  authentication: !!auth,
  functions: !!functions,
});
