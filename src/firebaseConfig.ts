import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG || "{}");

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, "africa-south1"); // Hard-aligned to JHB

// SECURE PROXY CALLS
const auditProxy = httpsCallable(functions, 'performForensicAudit');
const chatProxy = httpsCallable(functions, 'hunterChatProxy');

export const performAuditAnalysis = async (bizName: string, location: string) => {
  try {
    const result: any = await auditProxy({ bizName, location });
    return result.data.analysis;
  } catch (err) {
    return "SYSTEM_ERROR: Secure handshake failed.";
  }
};

export const callHunterAI = async (prompt: string) => {
  try {
    const result: any = await chatProxy({ prompt });
    return result.data.response;
  } catch (err) {
    return "Protocol active. Connect with Thabo directly for manual forensic analysis.";
  }
};
