import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin
admin.initializeApp();
const db = getFirestore();

// 1. FORENSIC AUDIT (GEMINI 3 FLASH)
export const performAudit = onCall({
  region: "us-central1",
  cors: true,
  maxInstances: 10,
}, async (request) => {
  const { businessName, location, clientEmail } = request.data;

  // Runtime keys are provided by the environment automatically
  const G_KEY = process.env.GEMINI_API_KEY;
  const P_KEY = process.env.PLACES_API_KEY;

  if (!businessName || !location || !clientEmail) {
    throw new HttpsError("invalid-argument", "Missing required fields.");
  }
  if (!G_KEY || !P_KEY) {
    throw new HttpsError("failed-precondition", "AI Core keys not found.");
  }

  try {
    // Stage 1: Intelligence Retrieval
    const pRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": P_KEY,
        "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri,places.businessStatus"
      },
      body: JSON.stringify({ textQuery: `${businessName} in ${location}` })
    });

    const pData = await pRes.json() as any;
    const biz = pData.places?.[0];
    const context = biz
      ? `VERIFIED: ${biz.displayName?.text}. Rating: ${biz.rating}. Reviews: ${biz.userRatingCount}.`
      : `GHOST: No data found for "${businessName}" in ${location}.`;

    // Stage 2: Gemini 3 Flash Neural Analysis
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are Hunter AI. Perform a Digital Audit on: ${businessName}.
Context: ${context}
Output STRICT JSON: { "score": number, "summary": "string", "truths": ["string", "string", "string"] }`
          }]
        }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const aiData = await aiRes.json() as any;
    const analysis = JSON.parse(aiData.candidates[0].content.parts[0].text);

    // Stage 3: Trigger Email Extension
    await db.collection("mail").add({
      to: [clientEmail],
      message: {
        subject: `[Intel Report] Status for ${businessName}`,
        html: `<h1>Score: ${analysis.score}/100</h1><p>${analysis.summary}</p>`,
      },
    });

    // Stage 4: Log Lead
    await db.collection("leads").add({
      businessName, email: clientEmail, score: analysis.score, timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, ...analysis };

  } catch (e: any) {
    throw new HttpsError("internal", `Audit Link Failed: ${e.message}`);
  }
});

// 2. STRATEGIC CHAT (GEMINI 3 FLASH)
export const hunterChat = onCall({
  region: "us-central1",
  cors: true,
  maxInstances: 10,
}, async (request) => {
  const { message } = request.data;
  const G_KEY = process.env.GEMINI_API_KEY;

  try {
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are Hunter AI. User says: "${message}". Respond in 1 sentence.` }] }]
      })
    });
    const data = await aiRes.json() as any;
    return { reply: data.candidates[0].content.parts[0].text.trim() };
  } catch (e) {
    throw new HttpsError("internal", "Comms offline.");
  }
});
