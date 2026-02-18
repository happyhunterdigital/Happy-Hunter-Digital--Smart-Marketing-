// src/firebaseConfig.ts
import { initializeApp, FirebaseApp, getApps, getApp } from "firebase/app";
import { getFirestore, Firestore, enableIndexedDbPersistence, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, Auth, connectAuthEmulator } from "firebase/auth";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFunctions, Functions, connectFunctionsEmulator } from "firebase/functions";

// Environment validation with detailed logging
const getEnvVar = (name: string): string => {
  const value = import.meta.env[name];
  if (!value || value === 'REPLACE_WITH_SECRET' || value === 'undefined') {
    console.warn(`⚠️ Missing or placeholder environment variable: ${name}`);
    return '';
  }
  return value;
};

// Debug: Log all available env vars (remove in production)
if (import.meta.env.DEV) {
  console.log('Available env vars:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));
}

const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID'),
  measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID'),
};

// Circuit breaker pattern
let app: FirebaseApp;
let db: Firestore | null = null;
let auth: Auth | null = null;
let analytics: Analytics | null = null;
let functions: Functions | null = null;
let initializationError: Error | null = null;

const isConfigValid = (): boolean => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.authDomain &&
    firebaseConfig.appId
  );
};

// Initialize with error recovery
try {
  if (isConfigValid()) {
    // Prevent duplicate initialization
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    
    db = getFirestore(app);
    auth = getAuth(app);
    functions = getFunctions(app, 'africa-south1'); // Match your function region
    
    // Enable offline persistence (best effort)
    if (db && typeof window !== 'undefined') {
      enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.log('Persistence enabled in another tab');
        } else if (err.code === 'unimplemented') {
          console.log('Browser does not support persistence');
        }
      });
    }

    // Connect to emulators in development
    if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === 'true') {
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectAuthEmulator(auth, 'http://localhost:9099');
      if (functions) connectFunctionsEmulator(functions, 'localhost', 5001);
      console.log('🔧 Connected to Firebase emulators');
    }

    // Analytics only in production
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
  // Create dummy app to prevent crashes
  app = initializeApp({ projectId: 'demo-project', apiKey: 'demo-key' }, 'dummy');
}

// Safe exports
export { app, db, auth, analytics, functions, initializationError };

// Health check utility
export const getFirebaseStatus = () => ({
  initialized: !!app && !initializationError,
  database: !!db,
  authentication: !!auth,
  analytics: !!analytics,
  functions: !!functions,
  error: initializationError?.message || null,
  configValid: isConfigValid(),
});

// Type guard for database operations
export const requireDb = <T>(operation: (db: Firestore) => Promise<T>): Promise<T | null> => {
  if (!db) {
    console.warn('Database not available, operation skipped');
    return Promise.resolve(null);
  }
  return operation(db);
};

// Helper to call functions with proper error handling
export const callFunction = async <T>(name: string, data: any): Promise<T> => {
  if (!functions) {
    throw new Error('Firebase Functions not initialized');
  }
  
  const { httpsCallable } = await import('firebase/functions');
  const callable = httpsCallable(functions, name);
  
  try {
    const result = await callable(data);
    return result.data as T;
  } catch (error: any) {
    console.error(`Function ${name} failed:`, error);
    if (error.code === 'functions/unauthenticated') {
      throw new Error('Authentication required. Please sign in.');
    }
    if (error.code === 'functions/unavailable') {
      throw new Error('Service temporarily unavailable. Please try again.');
    }
    throw error;
  }
};
