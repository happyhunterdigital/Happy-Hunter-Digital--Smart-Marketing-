import * as functions from "firebase-functions/v2";
import { onCall, HttpsError } from "firebase-functions/v2/https";

// THE AUDIT SCHEMA: Forces the AI to be organized
const auditSchema = {
  type: "object",
  properties: {
    score: { type: "number" },
    analysis: {
      type: "array",
      items: {
        type: "object",
        properties: {
          heading: { type: "string" },
          content: { type: "string" },
          requirement: { type: "string" }
        }
      }
    }
  },
  required: ["score", "analysis"]
};

export const performForensicAudit = onCall({
  region: "africa-south1",
  secretKeys: ["GEMINI_API_KEY", "PLACES_API_KEY"]
}, async (request) => {
  const { bizName, location } = request.data;
  const geminiKey = process.env.GEMINI_API_KEY;
  const placesKey = process.env.PLACES_API_KEY;

  try {
    // 1. MAPS DATA EXTRACTION
    const mapsRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": placesKey || "", "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri" },
      body: JSON.stringify({ textQuery: `${bizName} in ${location}`, maxResultCount: 1 })
    });
    const mapsData = await mapsRes.json();
    const biz = mapsData.places?.[0];
    const context = biz ? `✓ Rating: ${biz.rating}, Reviews: ${biz.userRatingCount}.` : `× Invisible.`;

    // 2. AI REASONING (GEMINI 2.5 FLASH)
    const aiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
    const aiRes = await fetch(aiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Audit "${bizName}" in ${location}. DATA: ${context}. Expose pain points. Use ALL CAPS for emphasis. NO asterisks.` }] }],
        generationConfig: { 
          response_mime_type: "application/json",
          response_schema: auditSchema,
          temperature: 0.2
        }
      })
    });
    const aiData = await aiRes.json();
    return JSON.parse(aiData.candidates[0].content.parts[0].text);
  } catch (error) { throw new HttpsError("internal", "Handshake Failed."); }
});

export const hunterChatProxy = onCall({
  region: "africa-south1",
  secretKeys: ["GEMINI_API_KEY"]
}, async (request) => {
  const { prompt } = request.data;
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `SYSTEM: You are Hunter AI for Smart Marketing. Identity: Strategic consultant. Context: Integrated Wellth Summit 28 Feb. NO asterisks. Use [H]Word[/H] for yellow highlights. USER: ${prompt}` }] }]
      })
    });
    const data = await res.json();
    return { response: data.candidates[0].content.parts[0].text };
  } catch (error) { throw new HttpsError("internal", "Chat Failed."); }
});
