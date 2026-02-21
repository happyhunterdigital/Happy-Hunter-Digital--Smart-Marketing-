import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

admin.initializeApp();
const db = getFirestore();

// 1. SMART MARKETING SCAN (GEMINI 2.0 FLASH)
export const performAudit = onCall({
  region: "us-central1",
  cors: true,
  maxInstances: 10,
}, async (request) => {
  const { businessName, location, clientEmail } = request.data;
  const G_KEY = process.env.GEMINI_API_KEY;
  const P_KEY = process.env.PLACES_API_KEY;

  if (!G_KEY || !P_KEY) throw new HttpsError("failed-precondition", "AI Core Offline.");

  try {
    // Maps Intelligence
    const pRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": P_KEY, "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount" },
      body: JSON.stringify({ textQuery: `${businessName} in ${location}` })
    });
    const pData = await pRes.json() as any;
    const biz = pData.places?.[0];

    // AI Generation (Gemini 2.0 Flash)
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Audit: ${businessName}. Data: ${biz ? 'Found' : 'Ghost'}. JSON format: { "score": number, "summary": "string", "truths": ["string"] }` }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const aiData = await aiRes.json() as any;
    const analysis = JSON.parse(aiData.candidates[0].content.parts[0].text);

    // Persistence
    await db.collection("mail").add({
      to: [clientEmail],
      message: {
        subject: `[Intelligence Report] Status: ${businessName}`,
        html: `<h1>Score: ${analysis.score}/100</h1><p>${analysis.summary}</p>`,
      }
    });

    return { success: true, ...analysis };
  } catch (e) {
    throw new HttpsError("internal", "Neural Handshake Interrupted.");
  }
});

// 2. STRATEGIC CHAT (GEMINI 2.0 FLASH)
export const hunterChat = onCall({
  region: "us-central1",
  cors: true,
}, async (request) => {
  const { message } = request.data;
  try {
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are Hunter AI. User: ${message}. 1 sentence response.` }] }]
      })
    });
    const data = await aiRes.json() as any;
    return { reply: data.candidates[0].content.parts[0].text };
  } catch (e) {
    return { reply: "Comms offline." };
  }
});
