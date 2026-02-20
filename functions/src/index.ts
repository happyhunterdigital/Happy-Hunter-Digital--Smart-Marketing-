import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

admin.initializeApp();
const db = getFirestore();

// 1. SMART MARKETING AUDIT
export const performAudit = onCall({
  region: "us-central1",
  cors: true,       // Allows requests from your website
  maxInstances: 10, // Prevents cold start overloads
  timeoutSeconds: 300, // CRITICAL FIX: Increased to 5 mins for deep AI analysis
  memory: "512MiB", // Boosted memory for JSON parsing
}, async (request) => {
  const { businessName, location, clientEmail } = request.data;

  // 1. Environment Check
  const G_KEY = process.env.GEMINI_API_KEY;
  const P_KEY = process.env.PLACES_API_KEY;

  if (!G_KEY || !P_KEY) {
    console.error("Missing API Keys on Server");
    throw new HttpsError("failed-precondition", "Server misconfiguration: Missing Keys.");
  }

  if (!businessName || !location || !clientEmail) {
    throw new HttpsError("invalid-argument", "Missing required fields.");
  }

  try {
    console.log(`Starting Audit: ${businessName} in ${location}`);

    // 2. Google Places Intelligence (Live Data)
    const placesUrl = "https://places.googleapis.com/v1/places:searchText";
    const pRes = await fetch(placesUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": P_KEY,
        "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri,places.businessStatus,places.formattedAddress"
      },
      body: JSON.stringify({ textQuery: `${businessName} in ${location}` })
    });

    if (!pRes.ok) {
      const err = await pRes.text();
      console.error("Maps API Error:", err);
      // Don't crash, just log it and proceed with "Ghost" context
    }

    const pData = await pRes.json() as any;
    const biz = pData.places?.[0];
    
    const context = biz
      ? `LIVE DATA: Name: ${biz.displayName?.text}. Rating: ${biz.rating || 'N/A'}. Reviews: ${biz.userRatingCount || 0}. Address: ${biz.formattedAddress}.`
      : `GHOST DATA: No confirmed Google Maps profile found for "${businessName}" in "${location}".`;

    // 3. Gemini 2.0 Flash Analysis
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${G_KEY}`;
    
    const aiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are Hunter AI, an elite digital marketing auditor.
TARGET: ${businessName}
LOCATION: ${location}
INTELLIGENCE: ${context}

TASK: Perform a forensic digital audit.
1. Score their visibility (0-100). If 'GHOST DATA', score is automatically < 30.
2. Write a 2-sentence executive summary.
3. Identify 3 specific, brutal truths about their missing visibility.

OUTPUT FORMAT (Strict JSON):
{
  "score": number,
  "summary": "string",
  "truths": ["string", "string", "string"]
}`
          }]
        }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.4 }
      })
    });

    if (!aiRes.ok) {
      const aiErr = await aiRes.text();
      console.error("Gemini API Error:", aiErr);
      throw new Error(`AI Brain Offline: ${aiRes.status}`);
    }

    const aiData = await aiRes.json() as any;
    const rawJSON = aiData.candidates[0].content.parts[0].text;
    const analysis = JSON.parse(rawJSON);

    // 4. Persistence & Dispatch
    await db.collection("leads").add({
      businessName,
      location,
      email: clientEmail,
      score: analysis.score,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      model: "Gemini 2.0 Flash"
    });

    await db.collection("mail").add({
      to: [clientEmail],
      message: {
        subject: `[Intelligence Report] Digital Status: ${businessName}`,
        html: `<h1>Audit Score: ${analysis.score}/100</h1><p>${analysis.summary}</p>`,
      }
    });

    return { success: true, ...analysis, placeData: biz || null };

  } catch (e: any) {
    console.error("Critical Audit Failure:", e);
    throw new HttpsError("internal", e.message || "Audit Protocol Failed");
  }
});

// 2. STRATEGIC CHAT (Hunter AI)
export const hunterChat = onCall({
  region: "us-central1",
  cors: true,
  maxInstances: 10,
}, async (request) => {
  const { message } = request.data;
  const G_KEY = process.env.GEMINI_API_KEY;

  if (!message) throw new HttpsError("invalid-argument", "No message.");

  try {
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `System: Hunter AI. User: "${message}". Reply in 1 sentence, military-grade precision.` }] }]
      })
    });
    const data = await aiRes.json() as any;
    return { reply: data.candidates[0].content.parts[0].text.trim() };
  } catch (e) {
    return { reply: "Secure link unstable. Check your connection." };
  }
});
