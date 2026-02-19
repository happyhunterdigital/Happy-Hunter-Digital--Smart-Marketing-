import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin
admin.initializeApp();
const db = getFirestore();

// 1. FORENSIC AUDIT (GEMINI 3 FLASH)
export const performAudit = onCall({
  region: "us-central1",
  secrets: ["GEMINI_API_KEY", "PLACES_API_KEY"],
  cors: true,
  maxInstances: 10,
}, async (request) => {
  const { businessName, location, clientEmail } = request.data;

  // Validate inputs
  if (!businessName || !location || !clientEmail) {
    throw new HttpsError("invalid-argument", "Missing required fields: businessName, location, clientEmail");
  }

  const G_KEY = process.env.GEMINI_API_KEY;
  const P_KEY = process.env.PLACES_API_KEY;

  if (!G_KEY || !P_KEY) {
    throw new HttpsError("failed-precondition", "API keys not configured");
  }

  try {
    // Stage 1: Intelligence Retrieval (Google Places API)
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

    if (!pRes.ok) {
      throw new Error(`Places API error: ${pRes.status}`);
    }

    const pData = await pRes.json() as any;
    const biz = pData.places?.[0];
    const context = biz
      ? `VERIFIED: ${biz.displayName?.text}. Rating: ${biz.rating || 'N/A'}. Reviews: ${biz.userRatingCount || 0}. Status: ${biz.businessStatus}. Address: ${biz.formattedAddress || 'N/A'}`
      : `GHOST: No Maps data found for "${businessName}" in ${location}.`;

    // Stage 2: Gemini 3 Flash Neural Scan
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are Hunter AI. Perform a Digital Entity Audit on: ${businessName}.
Context: ${context}
Task: Analyze their digital presence and provide a forensic assessment.
Rate their visibility 0-100.
Identify 3 critical invisibility gaps.
Output STRICT JSON format:
{
  "score": number,
  "summary": "string (2 sentences max)",
  "truths": ["string", "string", "string"]
}`
          }]
        }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
          maxOutputTokens: 1024
        }
      })
    });

    if (!aiRes.ok) {
      throw new Error(`Gemini API error: ${aiRes.status}`);
    }

    const aiData = await aiRes.json() as any;
    if (!aiData.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid Gemini response structure");
    }

    const analysis = JSON.parse(aiData.candidates[0].content.parts[0].text);

    // Validate analysis structure
    if (typeof analysis.score !== 'number' || !Array.isArray(analysis.truths)) {
      throw new Error("Invalid analysis format from AI");
    }

    // Stage 3: Trigger Email via Firestore Extension
    const emailHtml = `
      <h1 style="color:#eab308;font-family:Arial,sans-serif;">Protocol: Digital Entity Scan</h1>
      <p><strong>Target:</strong> ${businessName}</p>
      <p><strong>Location:</strong> ${location}</p>
      <hr style="border:1px solid #333;margin:20px 0;"/>
      <h2 style="color:${analysis.score > 70 ? '#22c55e' : analysis.score > 40 ? '#eab308' : '#ef4444'};">
        Visibility Score: ${analysis.score}/100
      </h2>
      <p><strong>Hunter AI Analysis:</strong> ${analysis.summary}</p>
      <hr style="border:1px solid #333;margin:20px 0;"/>
      <h3 style="color:#ef4444;">Critical Gaps Identified:</h3>
      <ul>
        ${analysis.truths.map((truth: string) => `<li style="margin:10px 0;color:#666;">${truth}</li>`).join('')}
      </ul>
      <p style="margin-top:30px;padding:20px;background:#f9fafb;border-left:4px solid #eab308;">
        Your digital entity is ${analysis.score < 50 ? 'highly vulnerable' : 'at risk'}.
        The "Ghost Effect" is preventing AI search engines from recommending you.
        Schedule a counter-intelligence briefing immediately.
      </p>
      <a href="https://happyhunterdigital.com" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#eab308;color:#000;text-decoration:none;font-weight:bold;border-radius:6px;">
        Secure Your Entity
      </a>
      <br/><br/>
      <p style="color:#999;font-size:12px;"><em>End of Transmission. / Happy Hunter Command</em></p>
    `;

    await db.collection("mail").add({
      to: [clientEmail],
      message: {
        subject: `[Intelligence Report] Entity Status for ${businessName}`,
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
      summary: analysis.summary,
      truths: analysis.truths,
      placeData: biz || null,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      model: 'Gemini 2.0 Flash',
      status: 'new'
    });

    // Return analysis to frontend
    return {
      success: true,
      score: analysis.score,
      summary: analysis.summary,
      truths: analysis.truths,
      placeData: biz || null
    };

  } catch (e: any) {
    console.error("Gemini 3 Audit Failure:", e);
    throw new HttpsError("internal", `Audit failed: ${e.message}`);
  }
});

// 2. STRATEGIC CHAT (Hunter AI Chatbot)
export const hunterChat = onCall({
  region: "us-central1",
  secrets: ["GEMINI_API_KEY"],
  cors: true,
  maxInstances: 10,
}, async (request) => {
  const { message } = request.data;

  if (!message || typeof message !== 'string') {
    throw new HttpsError("invalid-argument", "Message is required");
  }

  const G_KEY = process.env.GEMINI_API_KEY;

  if (!G_KEY) {
    throw new HttpsError("failed-precondition", "Gemini API key not configured");
  }

  try {
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are Hunter AI, the strategic digital marketing assistant for Happy Hunter Digital.
Your personality: Direct, authoritative, slightly mysterious, military-inspired but professional.
You help businesses understand Entity SEO, AI visibility, and digital presence optimization.
User message: "${message}"
Respond in 1-2 sentences maximum. Be helpful but concise. If they ask about pricing or services, direct them to schedule a briefing.`
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 256
        }
      })
    });

    if (!aiRes.ok) {
      throw new Error(`Gemini API error: ${aiRes.status}`);
    }

    const data = await aiRes.json() as any;
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid response from AI");
    }

    const reply = data.candidates[0].content.parts[0].text.trim();

    return {
      success: true,
      reply: reply || "Signal interference. Please retry."
    };

  } catch (e: any) {
    console.error("Chat error:", e);
    throw new HttpsError("internal", "Comms link offline. Please email HQ.");
  }
});

// Health check function
export const healthCheck = onCall({
  region: "us-central1",
  cors: true,
}, async () => {
  return {
    status: "operational",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  };
});
