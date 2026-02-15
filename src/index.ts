import * as functions from "firebase-functions/v2";
import { onCall, HttpsError } from "firebase-functions/v2/https";

// We force the JHB region to ensure speed and POPIA compliance
export const performForensicAudit = onCall({ 
  region: "africa-south1", 
  secretKeys: ["GEMINI_API_KEY", "PLACES_API_KEY"] 
}, async (request) => {
  const { bizName, location } = request.data;
  
  try {
    // 1. FORENSIC MAPS EXTRACTION (Private Server-Side)
    const mapsRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.PLACES_API_KEY || "",
        "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri,places.formattedAddress"
      },
      body: JSON.stringify({ textQuery: `${bizName} in ${location}`, maxResultCount: 1 })
    });
    const mapsData = await mapsRes.json();
    const biz = mapsData.places?.[0];
    const context = biz 
      ? `Verified: ${biz.rating} stars, ${biz.userRatingCount} reviews. Website: ${biz.websiteUri || 'None'}.` 
      : `Invisible Entity. No Maps presence.`;

    // 2. STRATEGIC AI VERDICT (Gemini 2.5 Flash)
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are Hunter AI for Smart Marketing. Audit "${bizName}" in ${location}. REAL DATA: ${context}. Expose pain points. NO asterisks. End with FINAL_SCORE: [number].` }] }]
      })
    });
    const aiData = await aiRes.json();
    return { analysis: aiData.candidates[0].content.parts[0].text };

  } catch (error) {
    throw new HttpsError("internal", "Vault Handshake Failed.");
  }
});

// SECURE CHAT PROXY
export const hunterChatProxy = onCall({ 
  region: "africa-south1", 
  secretKeys: ["GEMINI_API_KEY"] 
}, async (request) => {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: `You are Hunter AI, Assistant for Smart Marketing. No asterisks. Help this user: ${request.data.prompt}` }] }] })
    });
    const data = await res.json();
    return { response: data.candidates[0].content.parts[0].text };
  } catch (error) { throw new HttpsError("internal", "Chat Failed."); }
});
