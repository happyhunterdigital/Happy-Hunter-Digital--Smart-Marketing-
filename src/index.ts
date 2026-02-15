import * as functions from "firebase-functions/v2";
import { onCall, HttpsError } from "firebase-functions/v2/https";

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

  try {
    // 1. FORENSIC MAPS EXTRACTION
    const mapsRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": process.env.PLACES_API_KEY || "", "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri" },
      body: JSON.stringify({ textQuery: `${bizName} in ${location}`, maxResultCount: 1 })
    });
    const mapsData = await mapsRes.json();
    const biz = mapsData.places?.[0];
    const context = biz ? `Verified: ${biz.rating} stars, ${biz.userRatingCount} reviews.` : `Invisible Entity.`;

    // 2. STRATEGIC AI VERDICT (GEMINI 2.5 FLASH)
    const aiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const aiRes = await fetch(aiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Perform an unsparing forensic audit for "${bizName}" in ${location}. REAL DATA: ${context}. Expose pain points. Use ALL CAPS for strategic words. NO asterisks.` }] }],
        generationConfig: { response_mime_type: "application/json", response_schema: auditSchema, temperature: 0.2 }
      })
    });
    const aiData = await aiRes.json();
    return JSON.parse(aiData.candidates[0].content.parts[0].text);
  } catch (error) { throw new HttpsError("internal", "Handshake Interrupted."); }
});

export const hunterChatProxy = onCall({ 
  region: "africa-south1", 
  secretKeys: ["GEMINI_API_KEY"] 
}, async (request) => {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: `You are Hunter AI for Smart Marketing. Identity: Strategic Consultant. NO asterisks. Use [H]Word[/H] for highlights. QUERY: ${request.data.prompt}` }] }] })
    });
    const data = await res.json();
    return { response: data.candidates[0].content.parts[0].text };
  } catch (error) { throw new HttpsError("internal", "Chat Error."); }
});
