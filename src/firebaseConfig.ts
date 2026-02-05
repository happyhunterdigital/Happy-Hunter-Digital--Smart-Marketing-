import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 1. HARD-ALIGNED FIREBASE SETUP
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

// 2. SELF-HEALING AI CALLER
export const callHunterAI = async (prompt: string) => {
  // Pulling key from Secrets OR using the one you provided for immediate debug
  const KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyCdmPzVLVk0s7prinSgvxulfBZxLBTsA6U";
  
  const ENDPOINTS = [
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent"
  ];

  for (const url of ENDPOINTS) {
    try {
      const response = await fetch(`${url}?key=${KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `SYSTEM: You are Hunter AI for Happy Hunter Digital. Expert in SA Marketing. Goal: Help SMEs survive the AI filter. TONE: Professional. QUERY: ${prompt}` }] }]
        })
      });

      const data = await response.json();
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        return data.candidates[0].content.parts[0].text;
      }
    } catch (err) {
      continue;
    }
  }
  return "I'm having a connection hiccup. Please click the green WhatsApp button to chat with Thabo directly!";
};
