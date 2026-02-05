import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 1. HARD-CODED CONFIG (From your screenshot to ensure 0% chance of name mismatch)
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

// 2. THE ERROR-EXPOSING AI CALLER
export const callHunterAI = async (prompt: string) => {
  // We use the exact key from your AI Studio screenshot
  const KEY = "AIzaSyCdmPzVLVk0s7prinSgvxulfBZxLBTsA6U";
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    // IF GOOGLE SENDS AN ERROR, SHOW IT ON THE SCREEN
    if (data.error) {
      return `GOOGLE_ERROR: ${data.error.message} (Code: ${data.error.code})`;
    }

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return data.candidates[0].content.parts[0].text;
    }

    return "ERROR: Received empty response from Gemini.";

  } catch (err: any) {
    // IF THE BROWSER BLOCKS THE REQUEST, SHOW WHY
    return `BROWSER_NETWORK_ERROR: ${err.message}. Check if an ad-blocker is stopping the request.`;
  }
};
