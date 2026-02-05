import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 1. HARD-ALIGNED CONFIG (Directly from your screenshot)
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

// 2. SELF-HEALING AI CALLER
export const callHunterAI = async (prompt: string) => {
  // Use the secret if available, otherwise use the verified key from your screenshot
  const KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyCdmPzVLVk0s7prinSgvxulfBZxLBTsA6U";
  
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `SYSTEM: You are Hunter AI for Happy Hunter Digital. Expert in SA Marketing. QUERY: ${prompt}` }] }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return `GOOGLE_ERROR: ${data.error.message} (Code: ${data.error.code})`;
    }

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return data.candidates[0].content.parts[0].text;
    }
    
    return "ERROR: AI response was empty.";
  } catch (err: any) {
    return `NETWORK_ERROR: ${err.message}. Please check your connection.`;
  }
};
