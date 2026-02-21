import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();

// 1. SMART MARKETING AUDIT
export const performAudit = onCall({
  region: "us-central1",
  cors: true,
  timeoutSeconds: 300,
}, async (request) => {
  const { businessName, location, clientEmail } = request.data;
  const G_KEY = process.env.GEMINI_API_KEY;
  const P_KEY = process.env.PLACES_API_KEY;

  if (!businessName || !G_KEY || !P_KEY) {
    throw new HttpsError("failed-precondition", "Configuration or input missing.");
  }

  try {
    const pRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": P_KEY, "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount" },
      body: JSON.stringify({ textQuery: `${businessName} in ${location}` })
    });
    
    const pData = await pRes.json() as any;
    const biz = pData.places?.[0];
    const context = biz 
      ? `VERIFIED: ${biz.displayName?.text}. Rating: ${biz.rating}. Reviews: ${biz.userRatingCount}.` 
      : `GHOST: No data found for ${businessName}.`;

    // STRICTLY USING gemini-flash-latest
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are Hunter AI. Audit: ${businessName}. Data: ${context}. No asterisks. Output JSON: { "score": number, "summary": "string", "truths": ["string", "string", "string"] }` }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.2 }
      })
    });

    const aiData = await aiRes.json() as any;
    const analysis = JSON.parse(aiData.candidates[0].content.parts[0].text);

    // Save lead
    await admin.firestore().collection("leads").add({ businessName, email: clientEmail, score: analysis.score, timestamp: admin.firestore.FieldValue.serverTimestamp() });

    return { success: true, ...analysis };

  } catch (e: any) {
    console.error(e);
    throw new HttpsError("internal", "Neural Link Failed");
  }
});

// 2. STRATEGIC CHAT
export const hunterChat = onCall({
  region: "us-central1",
  cors: true,
}, async (request) => {
  const { message } = request.data;
  try {
    // STRICTLY USING gemini-flash-latest
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are Hunter AI. User says: ${message}. Respond in 1-2 sentences with military-grade precision.` }] }]
      })
    });
    const data = await aiRes.json() as any;
    return { reply: data.candidates[0].content.parts[0].text };
  } catch (e) {
    return { reply: "Comms offline." };
  }
});
