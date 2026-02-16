// 🛡️ IRON DOME: Secure Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';

// Validate environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

// 🚨 Security: Validate all required config exists
for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    throw new Error(`🔒 IRON DOME: Missing required environment variable: ${envVar}`);
  }
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize with error boundary
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('🔥 Firebase initialized successfully');
} catch (error) {
  console.error('🔒 IRON DOME: Firebase initialization failed:', error);
  throw error;
}

// Export secured instances
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, 'africa-south1');

// 🛡️ Emulator connection for development only
if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === 'true') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFunctionsEmulator(functions, 'localhost', 5001);
  console.log('🔧 Connected to Firebase emulators');
}

// 🔒 Secure Cloud Function Callers with retry logic
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function secureCall<T = any>(
  functionName: string,
  data: any,
  attempt = 1
): Promise<T> {
  try {
    const functionRef = httpsCallable(functions, functionName);
    const result = await functionRef(data);
    return result.data as T;
  } catch (error: any) {
    // Retry on network errors
    if (attempt < MAX_RETRIES && error.code === 'unavailable') {
      console.warn(`🔄 Retry ${attempt}/${MAX_RETRIES} for ${functionName}`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
      return secureCall(functionName, data, attempt + 1);
    }
    
    console.error(`🔒 IRON DOME: ${functionName} failed:`, error);
    throw new HttpsError(error.code || 'internal', error.message);
  }
}

// Export secured functions
export const performAuditAnalysis = (bizName: string, location: string) =>
  secureCall('performForensicAudit', { bizName, location });

export const callHunterAI = (prompt: string) =>
  secureCall('hunterChatProxy', { prompt });

// Custom error class
class HttpsError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'HttpsError';
  }
}
