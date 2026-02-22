import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// 1. SMART MARKETING AUDIT
export const performAudit = onCall({
  region: "us-central1",
  cors: true,
  maxInstances: 10,
  timeoutSeconds: 300
}, async (request) => {
  const { businessName, location, clientEmail } = request.data;
  const G_KEY = process.env.GEMINI_API_KEY;
  const P_KEY = process.env.PLACES_API_KEY;

  if (!businessName || !location || !clientEmail) throw new HttpsError("invalid-argument", "Missing required fields.");
  if (!G_KEY || !P_KEY) throw new HttpsError("failed-precondition", "AI Core Offline.");

  try {
    const pRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": P_KEY, "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount" },
      body: JSON.stringify({ textQuery: `${businessName} in ${location}` })
    });
    const pData = await pRes.json() as any;
    const biz = pData.places?.[0];

    const context = biz 
      ? `Verified: ${biz.displayName?.text}. Rating: ${biz.rating}. Reviews: ${biz.userRatingCount}.`
      : `Ghost: No Maps data found for ${businessName}.`;

    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are Hunter AI. Audit: ${businessName}. Data: ${context}. No asterisks. Format JSON: { "score": number, "summary": "string", "truths": ["string", "string", "string"] }` }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const aiData = await aiRes.json() as any;
    const analysis = JSON.parse(aiData.candidates[0].content.parts[0].text);

    // Save lead and trigger email
    await db.collection("leads").add({ businessName, email: clientEmail, score: analysis.score, timestamp: admin.firestore.FieldValue.serverTimestamp() });
    await db.collection("mail").add({
      to: [clientEmail],
      message: {
        subject: `[Intelligence Report] Status: ${businessName}`,
        html: `<h1>Score: ${analysis.score}/100</h1><p>${analysis.summary}</p>`,
      }
    });

    return { success: true, ...analysis };
  } catch (e: any) {
    throw new HttpsError("internal", `Neural Handshake Interrupted.`);
  }
});

// 2. STRATEGIC CHAT
export const hunterChat = onCall({
  region: "us-central1",
  cors: true,
}, async (request) => {
  const { message } = request.data;
  try {
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are Hunter AI. User: ${message}. Respond in 1 sentence.` }] }]
      })
    });
    const data = await aiRes.json() as any;
    return { reply: data.candidates[0].content.parts[0].text };
  } catch (e) {
    return { reply: "Comms offline." };
  }
});
