// src/firebaseConfig.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getAnalytics, Analytics } from "firebase/analytics";

// Environment validation
const getEnvVar = (name: string): string => {
  const value = import.meta.env[name];
  if (!value) {
    console.warn(`⚠️ Missing environment variable: ${name}`);
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

// Circuit breaker pattern for initialization
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let analytics: Analytics | null = null;
let initializationError: Error | null = null;

const isConfigValid = () => {
  return !!(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
};

try {
  if (isConfigValid()) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    
    // Enable offline persistence (best effort)
    if (db) {
      enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.log('Persistence enabled in another tab');
        } else if (err.code === 'unimplemented') {
          console.log('Browser does not support persistence');
        }
      });
    }

    // Analytics only in production with valid config
    if (import.meta.env.PROD && firebaseConfig.measurementId) {
      try {
        analytics = getAnalytics(app);
      } catch (e) {
        console.log('Analytics initialization skipped');
      }
    }
    
    console.log('✅ Firebase initialized successfully');
  } else {
    throw new Error('Invalid Firebase configuration - check environment variables');
  }
} catch (error: any) {
  initializationError = error;
  console.error('❌ Firebase initialization failed:', error.message);
  // App continues in degraded mode - NO CRASH
}

// Safe exports
export { app, db, auth, analytics, initializationError };

// Health check
export const getFirebaseStatus = () => ({
  initialized: !!app,
  database: !!db,
  authentication: !!auth,
  analytics: !!analytics,
  error: initializationError?.message || null,
  configValid: isConfigValid(),
});

// Type guard for database operations
export const requireDb = <T,>(operation: (db: Firestore) => Promise<T>): Promise<T | null> => {
  if (!db) {
    console.warn('Database not available, operation skipped');
    return Promise.resolve(null);
  }
  return operation(db);
};
