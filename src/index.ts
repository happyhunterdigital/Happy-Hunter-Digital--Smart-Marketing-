import * as functions from "firebase-functions/v2";
import { onCall, HttpsError } from "firebase-functions/v2/https";

export const performForensicAudit = onCall({
  region: "africa-south1",
  secretKeys: ["GEMINI_API_KEY", "PLACES_API_KEY"]
}, async (request) => {
  const { bizName, location } = request.data;
  const geminiKey = process.env.GEMINI_API_KEY;
  const placesKey = process.env.PLACES_API_KEY;

  try {
    // 1. QUERY SMART MARKETING GRAPH (MAPS)
    const mapsRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": placesKey || "",
        "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri,places.formattedAddress"
      },
      body: JSON.stringify({ textQuery: `${bizName} in ${location}`, maxResultCount: 1 })
    });
    const mapsData = await mapsRes.json();
    const biz = mapsData.places?.[0];
    const context = biz 
      ? `✓ VERIFIED: Rating ${biz.rating}/5 (${biz.userRatingCount} reviews). Website: ${biz.websiteUri || 'MISSING'}.`
      : `× INVISIBLE: No verified presence in the Knowledge Graph.`;

    // 2. GENERATE UNSPARING AUDIT
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are Hunter AI for Smart Marketing. Perform an unsparing forensic audit for "${bizName}" in ${location}. DATA: ${context}. MISSION: Expose pain points. RULES: Use [SECTION] for headers, [FIX] for actions. End with FINAL_SCORE: [number]. No asterisks.` }] }]
      })
    });
    const aiData = await aiRes.json();
    return { analysis: aiData.candidates[0].content.parts[0].text };
  } catch (error) { throw new HttpsError("internal", "Handshake Refused."); }
});

export const hunterChatProxy = onCall({
  region: "africa-south1",
  secretKeys: ["GEMINI_API_KEY"]
}, async (request) => {
  const { prompt } = request.data;
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: `You are Hunter AI, Assistant for Smart Marketing. Help SMEs with digital presence. User: ${prompt}` }] }] })
    });
    const data = await res.json();
    return { response: data.candidates[0].content.parts[0].text };
  } catch (error) { throw new HttpsError("internal", "Chat Failed."); }
});
