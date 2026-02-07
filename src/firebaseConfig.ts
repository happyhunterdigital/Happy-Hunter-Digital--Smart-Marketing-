import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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

export const callHunterAI = async (prompt: string) => {
  const KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyCdmPzVLVk0s7prinSgvxulfBZxLBTsA6U";
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ 
            text: `
              SYSTEM INSTRUCTIONS:
              You are Hunter AI, the Strategic Auditor for Happy Hunter Digital.
              IDENTITY: Professional, blunt, and strategic. 
              TONE: Focus exclusively on PAIN POINTS and missing elements.
              
              CATEGORIES TO ANALYZE:
              1. Local SEO (Maps, GMB, Local Pack failures).
              2. Social Media Audit (Brand signal and engagement voids).
              3. Digital Footprint (Data inconsistency and visibility gaps).
              4. Online Visibility (Answer Engine Optimization and AI Trust roadblocks).
              
              FORMATTING:
              - Use [SECTION] for category headers.
              - Use **BOLD** for critical failures.
              - Use [H]Word[/H] to highlight high-impact words.
              - Space out paragraphs clearly.
              
              USER QUERY: ${prompt}
            `
          }] 
        }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1500 }
      })
    });
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (err) { return "Handshake failed."; }
};
