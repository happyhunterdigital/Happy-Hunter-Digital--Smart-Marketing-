import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();

// --- 1. FORENSIC AUDIT (GEMINI FLASH LATEST) ---
export const performAudit = onCall({
  region: "us-central1",
  secrets: ["GEMINI_API_KEY", "PLACES_API_KEY"],
  cors: true,
  maxInstances: 10,
  timeoutSeconds: 300,
}, async (request) => {
  const { businessName, location } = request.data;
  const G_KEY = process.env.GEMINI_API_KEY;
  const P_KEY = process.env.PLACES_API_KEY;

  if (!G_KEY || !P_KEY) throw new HttpsError("failed-precondition", "Keys not found.");

  try {
    // Stage 1: Google Maps Data extraction
    const pRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": P_KEY },
      body: JSON.stringify({ textQuery: `${businessName} in ${location}` })
    });
    const pData = await pRes.json() as any;
    const biz = pData.places?.[0];

    const context = biz 
      ? `VERIFIED: ${biz.displayName?.text}. Rating: ${biz.rating}. Reviews: ${biz.userRatingCount}.` 
      : `GHOST: No data found for ${businessName} in ${location}.`;

    // Stage 2: Gemini Flash Latest Analysis
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are Hunter AI. Audit: ${businessName}. Context: ${context}. NO ASTERISKS. Output STRICT JSON: { "score": number, "summary": "string", "truths": ["string"] }` }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const aiData = await aiRes.json() as any;
    return JSON.parse(aiData.candidates[0].content.parts[0].text);

  } catch (e) {
    throw new HttpsError("internal", "Neural Handshake Failed");
  }
});

// --- 2. CHAT PROXY (GEMINI FLASH LATEST) ---
export const hunterChat = onCall({
  region: "us-central1",
  secrets: ["GEMINI_API_KEY"],
  cors: true,
}, async (request) => {
  const { message } = request.data;
  try {
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are Hunter AI. User says: ${message}. Respond in 1-2 sentences with military-grade precision.` }] }]
      })
    });
    const data = await aiRes.json() as any;
    return { reply: data.candidates[0].content.parts[0].text };
  } catch (e) {
    return { reply: "Comms link offline." };
  }
});
