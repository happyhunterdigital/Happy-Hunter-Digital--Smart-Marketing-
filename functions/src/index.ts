import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

admin.initializeApp();
const db = getFirestore();

// 1. SMART MARKETING AUDIT (WITH LIVE GOOGLE MAPS DATA)
export const performAudit = onCall({
  region: "us-central1",
  cors: true,
  maxInstances: 10,
}, async (request) => {
  const { businessName, location, clientEmail } = request.data;

  const G_KEY = process.env.GEMINI_API_KEY;
  const P_KEY = process.env.PLACES_API_KEY;

  if (!businessName || !location || !clientEmail) {
    throw new HttpsError("invalid-argument", "Missing required fields.");
  }
  if (!G_KEY || !P_KEY) {
    throw new HttpsError("failed-precondition", "API keys not configured.");
  }

  try {
    // Stage 1: LIVE GOOGLE MAPS INTELLIGENCE
    const pRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": P_KEY,
        "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri,places.businessStatus,places.formattedAddress"
      },
      body: JSON.stringify({ textQuery: `${businessName} in ${location}` })
    });

    if (!pRes.ok) throw new Error(`Google Maps API Error: ${pRes.status}`);

    const pData = await pRes.json() as any;
    const biz = pData.places?.[0];
    
    // CONTEXT for AI is now based on REAL data
    const context = biz
      ? `LIVE DATA FOUND: Business Name: ${biz.displayName?.text}. Google Rating: ${biz.rating || 'Not Available'}. Review Count: ${biz.userRatingCount || 0}. Status: ${biz.businessStatus}.`
      : `LIVE DATA NOT FOUND: The business "${businessName}" in ${location} is not easily discoverable on Google Maps, indicating a significant 'near me' visibility issue.`;

    // Stage 2: Gemini Analysis
    let analysis;
    
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a Google Maps optimization expert. Analyze this business: ${businessName}.
LIVE DATA: ${context}
TASK: Analyze their 'Near Me' visibility on Google Maps. Rate their visibility from 0 to 100.
Identify 3 actionable steps they should take to improve their Google Business Profile ranking.
OUTPUT: Strict JSON format: { "score": number, "summary": "string (professional summary of their Maps presence)", "truths": ["string", "string", "string"] }`
          }]
        }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.5 }
      })
    });

    if (aiRes.status === 429) {
      console.warn("Gemini Rate Limit (429) Hit. Using Fallback Data.");
      analysis = {
        score: biz ? 55 : 35,
        summary: `Our AI is experiencing high traffic. Based on a rapid scan, ${businessName} shows opportunities for significant growth in local search visibility.`,
        truths: [
          "Optimize Google Business Profile categories for your specific niche.",
          "Implement a strategy to consistently gather new, high-quality customer reviews.",
          "Ensure your business Name, Address, and Phone (NAP) are identical across all online directories."
        ]
      };
    } else if (!aiRes.ok) {
      throw new Error(`AI error: ${aiRes.status}`);
    } else {
      const aiData = await aiRes.json() as any;
      analysis = JSON.parse(aiData.candidates[0].content.parts[0].text);
    }

    // Stage 3: Send Email
    const emailHtml = `... (email logic here) ...`;
    await db.collection("mail").add({
      to: [clientEmail],
      message: {
        subject: `Your Google Maps Audit Results: ${businessName}`,
        html: emailHtml,
      },
    });

    // Stage 4: Persist lead
    await db.collection("leads").add({ businessName, location, email: clientEmail, score: analysis.score, timestamp: admin.firestore.FieldValue.serverTimestamp() });

    return { success: true, ...analysis, placeData: biz || null };

  } catch (e: any) {
    throw new HttpsError("internal", `Audit failed: ${e.message}`);
  }
});

// ... (hunterChat function remains the same) ...
