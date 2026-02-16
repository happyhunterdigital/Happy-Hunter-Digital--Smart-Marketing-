import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";

// Your Firebase config from the console (these are public, safe to expose)
const firebaseConfig = {
  apiKey: "AIzaSyBQvZ2-w9DrJWQEgy4IarClycARAvMJIAc",
  authDomain: "happyhunterdigital-17480.firebaseapp.com",
  projectId: "happyhunterdigital-17480",
  storageBucket: "happyhunterdigital-17480.firebasestorage.app",
  messagingSenderId: "449102421348",
  appId: "1:449102421348:web:d61e0c209b93bf282fae71",
  measurementId: "G-PS04HKGEXF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, "africa-south1");

// Connect to emulator in development
if (import.meta.env.DEV) {
  // connectFunctionsEmulator(functions, "localhost", 5001);
}

// SECURE CALLERS - These call the Firebase Functions (server-side)
export const performAuditAnalysis = async (bizName: string, location: string) => {
  try {
    const auditProxy = httpsCallable(functions, 'performForensicAudit');
    const result = await auditProxy({ bizName, location });
    return result.data as { analysis: any[], score: number, rawResponse: string, mapsData: any };
  } catch (err: any) {
    console.error("Audit handshake failed:", err);
    return {
      analysis: [{
        heading: "System Error",
        content: "Secure handshake failed. The AI audit engine is temporarily unavailable.",
        type: "error"
      }],
      score: 0,
      rawResponse: err.message,
      mapsData: null
    };
  }
};

export const callHunterAI = async (prompt: string) => {
  try {
    const chatProxy = httpsCallable(functions, 'hunterChatProxy');
    const result = await chatProxy({ prompt });
    return (result.data as { response: string }).response;
  } catch (err: any) {
    console.error("Chat handshake failed:", err);
    return "SIGNAL INTERRUPTED: Handshake failed. Please book a call at https://calendly.com/motsumitl/30min";
  }
};
