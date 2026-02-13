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
  appId: "1:449102421348:web:d61e0c209b93bf282fae71",
  measurementId: "G-PS04HKGEXF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, "africa-south1");

// ==========================================
// SECURE FUNCTION CALLERS (Client-Side)
// ==========================================

export const performAuditAnalysis = async (bizName: string, location: string) => {
  const performForensicAudit = httpsCallable(functions, 'performForensicAudit');
  
  try {
    const result = await performForensicAudit({ bizName, location });
    return result.data as { 
      analysis: string; 
      rawData: any; 
      timestamp: string;
    };
  } catch (error: any) {
    console.error("Audit function error:", error);
    throw new Error(error.message || "Forensic audit failed");
  }
};

export const callHunterAI = async (prompt: string, sessionContext?: string) => {
  const hunterChatProxy = httpsCallable(functions, 'hunterChatProxy');
  
  try {
    const result = await hunterChatProxy({ prompt, sessionContext });
    return (result.data as { response: string }).response;
  } catch (error: any) {
    console.error("Chat function error:", error);
    return "Handshake failed. Please try again.";
  }
};

// ==========================================
// LEGACY: Direct API Fallback (Development Only)
// ==========================================

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const PLACES_KEY = import.meta.env.VITE_PLACES_API_KEY || "";

export const fetchMapsData = async (bizName: string, location: string) => {
  const URL = "https://places.googleapis.com/v1/places:searchText";
  
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": PLACES_KEY,
        "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri"
      },
      body: JSON.stringify({
        textQuery: `${bizName} in ${location}`,
        maxResultCount: 1
      })
    });
    
    const data = await response.json();
    
    if (!data.places?.length) {
      return {
        found: false,
        message: "Handshake refused by Smart Marketing Graph."
      };
    }
    
    const biz = data.places[0];
    return {
      found: true,
      name: biz.displayName?.text,
      rating: biz.rating || "N/A",
      reviews: biz.userRatingCount || 0,
      website: biz.websiteUri || "Missing",
      address: biz.formattedAddress
    };
  } catch (err: any) {
    return { found: false, message: err.message };
  }
};
