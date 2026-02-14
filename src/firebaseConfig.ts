import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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

// API Keys from environment
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const PLACES_KEY = import.meta.env.VITE_PLACES_API_KEY || "";

// Forensic Audit - Returns STRING (not object) for compatibility
export const performAuditAnalysis = async (bizName: string, location: string): Promise<string> => {
  try {
    // Fetch from Google Places API
    const mapsRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": PLACES_KEY,
        "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri,places.formattedAddress"
      },
      body: JSON.stringify({
        textQuery: `${bizName} in ${location}`,
        maxResultCount: 1
      })
    });

    const mapsData = await mapsRes.json();
    const biz = mapsData.places?.[0];

    const context = biz 
      ? `✓ VERIFIED ENTITY: Rating ${biz.rating}/5 (${biz.userRatingCount} reviews). Website: ${biz.websiteUri || 'MISSING NODE'}.`
      : `× INVISIBLE ENTITY: No verified presence in Google Knowledge Graph.`;

    // Generate AI Analysis
    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are HUNTER AI, forensic auditor for Smart Marketing South Africa.

BUSINESS: "${bizName}" in ${location}
INTELLIGENCE: ${context}

MISSION: Perform "Handshake of Truth" audit. Identify Mirror Rule violations.

STRUCTURE:
[SECTION] THE MIRROR RULE VIOLATION
Explain gap between physical reputation and digital signals.

[SECTION] ESTIMATED REVENUE LEAKAGE
Calculate monthly revenue loss in ZAR from AI invisibility.

[SECTION] THE SURVIVAL PROTOCOL
3 specific, actionable fixes prioritized by impact.

[SECTION] FINAL SCORE
Format exactly as: FINAL_SCORE: [number 0-100]

Tone: Strategic, direct, unsparing. No asterisks. No markdown.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        })
      }
    );

    const aiData = await aiRes.json();
    return aiData.candidates?.[0]?.content?.parts?.[0]?.text || "ANALYSIS FAILURE";

  } catch (error) {
    console.error("Audit Error:", error);
    return "Forensic audit failed. Please try again.";
  }
};

// Chat Function - Returns STRING
export const callHunterAI = async (prompt: string): Promise<string> => {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are HUNTER, Senior Digital Strategist at Smart Marketing South Africa.

USER MESSAGE: ${prompt}

PERSONA RULES:
- Speak with authority and directness
- Never use asterisks, markdown, or robotic language
- Be concise, strategic, and actionable
- Never mention being an AI
- Reference Integrated Wellth Summit on 28 February 2026 when relevant
- Founder is Thabo Leslie Motsumi

Tone: Strategic Expert. South African market focus.`
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1024
          }
        })
      }
    );

    const data = await res.json();
    let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Handshake failed.";
    
    // Clean formatting
    responseText = responseText
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/As an AI/g, 'As a strategist')
      .replace(/I am an AI/g, 'I am a strategist');

    return responseText;

  } catch (error) {
    console.error("Chat Error:", error);
    return "Handshake failed. Please try again.";
  }
};
