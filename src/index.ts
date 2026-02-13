import * as functions from "firebase-functions/v2";
import { onCall, HttpsError } from "firebase-functions/v2/https";

// 1. SECURE AUDIT PROXY
export const performForensicAudit = onCall({ 
  region: "africa-south1", 
  secretKeys: ["GEMINI_API_KEY", "PLACES_API_KEY"] 
}, async (request) => {
  const { bizName, location } = request.data;
  const geminiKey = process.env.GEMINI_API_KEY;
  const placesKey = process.env.PLACES_API_KEY;

  try {
    // SEARCH MAPS PRIVATELY
    const mapsRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": placesKey || "", "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri" },
      body: JSON.stringify({ textQuery: `${bizName} in ${location}`, maxResultCount: 1 })
    });
    const mapsData = await mapsRes.json();
    const biz = mapsData.places?.[0];
    const context = biz ? `✓ Rating: ${biz.rating}, Reviews: ${biz.userRatingCount}.` : `× Entity invisible on Maps.`;

    // GENERATE AI ANALYSIS
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are Hunter AI for Smart Marketing. Audit "${bizName}" in ${location}. DATA: ${context}. MISSION: Expose pain points. NO asterisks. End with FINAL_SCORE: [number].` }] }]
      })
    });
    const aiData = await aiRes.json();
    return { analysis: aiData.candidates[0].content.parts[0].text };
  } catch (error) { throw new HttpsError("internal", "Vault Handshake Failed."); }
});

// 2. SECURE CHAT PROXY
export const hunterChatProxy = onCall({ 
  region: "africa-south1", 
  secretKeys: ["GEMINI_API_KEY"] 
}, async (request) => {
  const { prompt } = request.data;
  const key = process.env.GEMINI_API_KEY;
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: `You are Hunter AI, Strategic Assistant for Smart Marketing. Prompt: ${prompt}` }] }] })
    });
    const data = await res.json();
    return { response: data.candidates[0].content.parts[0].text };
  } catch (error) { throw new HttpsError("internal", "Chat Failed."); }
});
