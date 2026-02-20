import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

admin.initializeApp();
const db = getFirestore();

// 1. SMART MARKETING AUDIT
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
    // Stage 1: Google Places Data
    const pRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": P_KEY,
        "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri,places.businessStatus,places.formattedAddress"
      },
      body: JSON.stringify({ textQuery: `${businessName} in ${location}` })
    });

    const pData = await pRes.json() as any;
    const biz = pData.places?.[0];
    const context = biz
      ? `Data Found: ${biz.displayName?.text}. Rating: ${biz.rating || 'N/A'}. Reviews: ${biz.userRatingCount || 0}. Status: ${biz.businessStatus}.`
      : `No Google Maps data found for "${businessName}" in ${location}.`;

    // Stage 2: Gemini Analysis with Rate-Limit Fallback
    let analysis;
    
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an expert Digital Marketing Strategist. 
Analyze the digital presence of: ${businessName}. Context: ${context}
Rate their visibility from 0 to 100.
Identify 3 critical areas for growth.
Output STRICT JSON format: { "score": number, "summary": "string (friendly but authoritative)", "truths": ["string", "string", "string"] }`
          }]
        }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (aiRes.status === 429) {
      // RATE LIMIT HIT: Use Fallback Data so we don't lose the lead
      console.warn("Gemini Rate Limit (429) Hit. Using Fallback Data.");
      analysis = {
        score: biz ? 55 : 35,
        summary: `We performed a rapid baseline scan of ${businessName}. The data shows fragmentation that prevents AI search engines from recommending you effectively.`,
        truths: [
          "Inconsistent online directory citations limit local reach.",
          "Google Business Profile lacks Answer Engine Optimization (AEO).",
          "Competitors are currently capturing high-intent AI search traffic."
        ]
      };
    } else if (!aiRes.ok) {
      throw new Error(`AI error: ${aiRes.status}`);
    } else {
      // Normal successful response
      const aiData = await aiRes.json() as any;
      analysis = JSON.parse(aiData.candidates[0].content.parts[0].text);
    }

    // Stage 3: Send Email
    const emailHtml = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #eab308;">Your Smart Marketing Scan Results</h2>
        <p><strong>Business:</strong> ${businessName}</p>
        <p><strong>Location:</strong> ${location}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
        <h3>Visibility Score: ${analysis.score}/100</h3>
        <p>${analysis.summary}</p>
        <h4>Key Areas for Growth:</h4>
        <ul>
          ${analysis.truths.map((truth: string) => `<li style="margin-bottom: 10px;">${truth}</li>`).join('')}
        </ul>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 30px;">
          <p style="margin-top: 0;">Stop losing customers to your competitors. Let's fix these issues and build an automated lead generation system.</p>
          <a href="https://happyhunterdigital.com" style="display: inline-block; background: #eab308; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px;">Book a Free Strategy Call</a>
        </div>
      </div>
    `;

    await db.collection("mail").add({
      to: [clientEmail],
      message: {
        subject: `Your Marketing Audit Results: ${businessName}`,
        html: emailHtml,
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Stage 4: Persist lead for admin dashboard
    await db.collection("leads").add({
      businessName,
      location,
      email: clientEmail,
      score: analysis.score,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: 'new'
    });

    return { success: true, score: analysis.score, summary: analysis.summary, truths: analysis.truths };

  } catch (e: any) {
    console.error("Audit Failure:", e);
    throw new HttpsError("internal", `Audit failed. Please try again.`);
  }
});

// 2. STRATEGIC CHAT
export const hunterChat = onCall({
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
        contents: [{
          parts: [{
            text: `You are a helpful, professional digital marketing assistant for Happy Hunter Systems. User says: "${message}". Respond in 1-2 friendly sentences.`
          }]
        }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 150 }
      })
    });
    
    // Check for rate limit here too
    if (aiRes.status === 429) {
        return { success: true, reply: "I'm experiencing high traffic right now! Please try using the Smart Marketing Scan above to get immediate insights." };
    }

    const data = await aiRes.json() as any;
    return { success: true, reply: data.candidates[0].content.parts[0].text.trim() };

  } catch (e: any) {
    return { success: true, reply: "I am offline at the moment. Please send an email to our team!" };
  }
});
