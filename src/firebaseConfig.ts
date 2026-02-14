import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyBQvZ2-w9DrJWQEgy4IarClycARAvMJIAc",
  authDomain: "happyhunterdigital-17480.firebaseapp.com",
  projectId: "happyhunterdigital-17480",
  storageBucket: "happyhunterdigital-17480.firebasestorage.app",
  messagingSenderId: "449102421348",
  appId: "1:449102421348:web:d61e0c209b93bf282fae71"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, "africa-south1");

// SECURE CALLERS
const auditProxy = httpsCallable(functions, 'performForensicAudit');
const chatProxy = httpsCallable(functions, 'hunterChatProxy');

export const performAuditAnalysis = async (bizName: string, location: string) => {
  try {
    const result: any = await auditProxy({ bizName, location });
    return result.data.analysis;
  } catch (err) { return "SYSTEM_ERROR: Secure handshake failed."; }
};

export const callHunterAI = async (prompt: string) => {
  try {
    const result: any = await chatProxy({ prompt });
    return result.data.response;
  } catch (err) { return "Handshake failed. Contact Thabo directly."; }
};
