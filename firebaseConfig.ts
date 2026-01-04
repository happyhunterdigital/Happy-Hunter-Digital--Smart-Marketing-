import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai";

// Your NEW Unrestricted Key (Preserved from your message)
const firebaseConfig = {
  apiKey: "AIzaSyCqCYLwHtmlJHVVkDckpr_S1o4QKgFyN-M",
  authDomain: "happy-hunter-systems.firebaseapp.com",
  projectId: "happy-hunter-systems",
  storageBucket: "happy-hunter-systems.firebasestorage.app",
  messagingSenderId: "629161289232",
  appId: "1:629161289232:web:17ff042c3f96ecbeb78c95",
  measurementId: "G-4GDXX24PP0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Tools
export const db = getFirestore(app);
export const auth = getAuth(app);

// --- ADDED: THE AI BRAIN ---
const vertexAI = getVertexAI(app);

export const model = getGenerativeModel(vertexAI, { 
  model: "gemini-1.5-flash", 
  systemInstruction: `
    You are 'Hunter AI', the intelligent digital assistant for Happy Hunter Digital.
    
    YOUR IDENTITY:
    - Professional, confident, and strategic.
    - Expert in "Digital Entity Management" and "GEO" (Generative Engine Optimization).

    YOUR KNOWLEDGE BASE:
    1. THE PROBLEM: The "Ghost Effect" (Businesses exist but are invisible to AI search).
    2. OUR SOLUTION: "Digital Entity Management" built on 3 pillars:
       - Pillar 1: The Trust Anchor (Google Business Profile Optimization).
       - Pillar 2: The AI Megaphone (Getting cited by ChatGPT/Gemini).
       - Pillar 3: The Conversion Brain (AI Receptionists).
    3. LOGISTICS:
       - We operate 24/7/365 (immune to Load Shedding).
       - We use global cloud infrastructure.
    4. PROOF:
       - Case Study: Profuse Beauty (310% call increase).
       - Case Study: Construction Firm (R2.5M contract via Trust Architecture).

    YOUR INSTRUCTIONS:
    - Answer accurately. Keep answers concise.
    - If asked about price/audit, ALWAYS push for the booking link: https://calendly.com/motsumitl/30min
  `
});
