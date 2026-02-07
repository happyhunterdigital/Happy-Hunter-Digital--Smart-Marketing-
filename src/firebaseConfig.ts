import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 1. HARD-ALIGNED FIREBASE SETUP (happyhunterdigital-17480)
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

// 2. THE 2.5-FLASH AI CALLER
export const callHunterAI = async (prompt: string) => {
  // Use your verified API key string directly for absolute reliability
  const KEY = "AIzaSyCdmPzVLVk0s7prinSgvxulfBZxLBTsA6U";
  
  // URL aligned with the Gemini 2.5 Flash specifications
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ 
            text: `SYSTEM: You are Hunter AI for Happy Hunter Digital. You use the 2.5-Flash reasoning engine to audit South African SMEs. 
            CONTEXT: Expert in Entity Trust, Mirror Rule, and AEO. 
            TONE: Professional, Provocative, Strategic. 
            USER QUERY: ${prompt}` 
          }] 
        }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return `SYSTEM_ERROR: ${data.error.message} (Code: ${data.error.code})`;
    }

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return data.candidates[0].content.parts[0].text;
    }
    
    return "Signal established, but the 2.5-engine returned a null state.";
  } catch (err: any) {
    return `NETWORK_FAILURE: ${err.message}. Check browser console for CORS blocks.`;
  }
};
