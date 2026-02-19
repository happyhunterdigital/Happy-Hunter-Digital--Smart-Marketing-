import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
// IMPORTANT: We use dotenv to load the variables locally during build/emulation
import * as dotenv from "dotenv";

dotenv.config();
admin.initializeApp();
const db = getFirestore();

// 1. FORENSIC AUDIT (GEMINI 3 FLASH)
export const performAudit = onCall({
  // REMOVED: secrets property - bypassing GCP Secret Manager permissions
  region: "us-central1",
  cors: true,
  maxInstances: 10,
}, async (request) => {
  const { businessName, location, clientEmail } = request.data;

  // Validate inputs
  if (!businessName || !location || !clientEmail) {
    throw new HttpsError("invalid-argument", "Missing required fields.");
  }

  const G_KEY = process.env.GEMINI_API_KEY;
  const P_KEY = process.env.PLACES_API_KEY;

  if (!G_KEY || !P_KEY) {
    throw new HttpsError("failed-precondition", "API keys not configured on server runtime.");
  }

  try {
    const pRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": P_KEY,
        "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri,places.businessStatus,places.formattedAddress"
      },
      body: JSON.stringify({
        textQuery: `${businessName} in ${location}`
      })
    });

    if (!pRes.ok) throw new Error(`Places API error: ${pRes.status}`);

    const pData = await pRes.json() as any;
    const biz = pData.places?.[0];
    const context = biz
      ? `VERIFIED: ${biz.displayName?.text}. Rating: ${biz.rating || 'N/A'}. Reviews: ${biz.userRatingCount || 0}. Status: ${biz.businessStatus}.`
      : `GHOST: No Maps data found for "${businessName}" in ${location}.`;

    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are Hunter AI. Perform a Digital Entity Audit on: ${businessName}.
Context: ${context}
Task: Analyze their digital presence. Rate visibility 0-100. Identify 3 critical invisibility gaps.
Output STRICT JSON format: { "score": number, "summary": "string", "truths": ["string", "string", "string"] }`
          }]
        }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!aiRes.ok) throw new Error(`Gemini API error: ${aiRes.status}`);

    const aiData = await aiRes.json() as any;
    const analysis = JSON.parse(aiData.candidates[0].content.parts[0].text);

    // Trigger Email via Firestore Extension ( decoupled logic )
    await db.collection("mail").add({
      to: [clientEmail],
      message: {
        subject: `[Intelligence Report] Entity Status for ${businessName}`,
        html: `<h1>Score: ${analysis.score}/100</h1><p>${analysis.summary}</p>`,
      },
    });

    return { success: true, ...analysis, placeData: biz || null };

  } catch (e: any) {
    console.error("Gemini 3 Audit Failure:", e);
    throw new HttpsError("internal", `Audit failed: ${e.message}`);
  }
});

// 2. STRATEGIC CHAT
export const hunterChat = onCall({
  // REMOVED: secrets property
  region: "us-central1",
  cors: true,
  maxInstances: 10,
}, async (request) => {
  const { message } = request.data;
  const G_KEY = process.env.GEMINI_API_KEY;

  if (!message || !G_KEY) throw new HttpsError("invalid-argument", "Invalid request.");

  try {
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are Hunter AI. User says: "${message}". Respond strategically in 1-2 sentences.` }] }]
      })
    });

    const data = await aiRes.json() as any;
    return { success: true, reply: data.candidates[0].content.parts[0].text.trim() };

  } catch (e: any) {
    throw new HttpsError("internal", "Comms link offline.");
  }
});
