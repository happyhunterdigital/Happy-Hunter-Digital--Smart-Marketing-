import * as functions from "firebase-functions/v2";
import { onCall, HttpsError } from "firebase-functions/v2/https";

// ==========================================
// SECURE FORENSIC AUDIT PROXY
// ==========================================
export const performForensicAudit = onCall({
  region: "africa-south1",
  secretKeys: ["GEMINI_API_KEY", "PLACES_API_KEY"],
  cors: ["https://happyhunterdigital.com", "http://localhost:5173"]
}, async (request) => {
  const { bizName, location } = request.data;
  
  if (!bizName || !location) {
    throw new HttpsError("invalid-argument", "Business name and location are required.");
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const placesKey = process.env.PLACES_API_KEY;

  if (!geminiKey || !placesKey) {
    throw new HttpsError("failed-precondition", "API keys not configured.");
  }

  try {
    // Step 1: Query Google Places API v1
    const mapsRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": placesKey,
        "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri,places.formattedAddress"
      },
      body: JSON.stringify({
        textQuery: `${bizName} in ${location}`,
        maxResultCount: 1
      })
    });

    if (!mapsRes.ok) {
      throw new Error(`Places API error: ${mapsRes.status}`);
    }

    const mapsData = await mapsRes.json();
    const biz = mapsData.places?.[0];

    const context = biz 
      ? `✓ VERIFIED ENTITY: Rating ${biz.rating}/5 (${biz.userRatingCount} reviews). Website: ${biz.websiteUri || 'MISSING NODE'}. Address: ${biz.formattedAddress}.`
      : `× INVISIBLE ENTITY: No verified presence in Google Knowledge Graph. This business is digitally non-existent.`;

    // Step 2: Generate AI Forensic Analysis
    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are HUNTER AI, the forensic auditor for Smart Marketing South Africa.

BUSINESS: "${bizName}" in ${location}
INTELLIGENCE: ${context}

MISSION: Perform a "Handshake of Truth" audit. Be unsparing. Identify Mirror Rule violations where physical excellence is blocked by digital invisibility.

STRUCTURE YOUR RESPONSE:
[SECTION] THE MIRROR RULE VIOLATION
Explain the gap between physical reputation and digital signals.

[SECTION] ESTIMATED REVENUE LEAKAGE
Calculate monthly revenue loss in South African Rand (ZAR) from invisibility to AI search engines.

[SECTION] THE SURVIVAL PROTOCOL
3 specific, actionable fixes prioritized by impact.

[SECTION] FINAL SCORE
Format exactly as: FINAL_SCORE: [number 0-100]

Tone: Strategic, direct, unsparing. No asterisks. No markdown.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        })
      }
    );

    if (!aiRes.ok) {
      throw new Error(`Gemini API error: ${aiRes.status}`);
    }

    const aiData = await aiRes.json();
    const analysis = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "ANALYSIS FAILURE: Vault handshake incomplete.";

    return {
      analysis,
      rawData: biz ? {
        name: biz.displayName?.text,
        rating: biz.rating,
        reviewCount: biz.userRatingCount,
        website: biz.websiteUri,
        address: biz.formattedAddress
      } : null,
      timestamp: new Date().toISOString()
    };

  } catch (error: any) {
    console.error("Forensic Audit Error:", error);
    throw new HttpsError("internal", `Vault Handshake Failed: ${error.message}`);
  }
});

// ==========================================
// SECURE CHAT PROXY
// ==========================================
export const hunterChatProxy = onCall({
  region: "africa-south1",
  secretKeys: ["GEMINI_API_KEY"],
  cors: ["https://happyhunterdigital.com", "http://localhost:5173"]
}, async (request) => {
  const { prompt, sessionContext } = request.data;
  
  if (!prompt) {
    throw new HttpsError("invalid-argument", "Prompt is required.");
  }

  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    throw new HttpsError("failed-precondition", "Gemini API key not configured.");
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are HUNTER, Senior Digital Strategist at Smart Marketing South Africa.

CONTEXT: ${sessionContext || 'General inquiry about digital marketing services.'}

USER MESSAGE: ${prompt}

PERSONA RULES:
- Speak with authority and directness
- Never use asterisks, markdown, or robotic language
- Write like a seasoned consultant advising a business owner
- Be concise, strategic, and actionable
- Never mention being an AI
- Reference the Integrated Wellth Summit on 28 February 2026 when relevant
- Founder is Thabo Leslie Motsumi

Tone: Strategic Expert. South African market focus.`
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1024
          }
        })
      }
    );

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Handshake failed.";

    // Clean any accidental formatting
    responseText = responseText
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/As an AI/g, 'As a strategist')
      .replace(/I am an AI/g, 'I am a strategist');

    return { response: responseText };

  } catch (error: any) {
    console.error("Chat Proxy Error:", error);
    throw new HttpsError("internal", `Chat Failed: ${error.message}`);
  }
});
