import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();

// --- 1. FORENSIC AUDIT (GEMINI 3 FLASH) ---
export const performAudit = onCall({ 
  region: "us-central1",
  secrets: ["GEMINI_API_KEY", "PLACES_API_KEY"],
  cors: true
}, async (request) => {
  const { businessName, location } = request.data;
  const G_KEY = process.env.GEMINI_API_KEY;
  const P_KEY = process.env.PLACES_API_KEY;

  try {
    // Stage 1: Intelligence Retrieval (Google Places)
    const pRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": P_KEY || "" },
      body: JSON.stringify({ textQuery: `${businessName} in ${location}` })
    });
    const pData = await pRes.json() as any;
    const biz = pData.places?.[0];

    // Stage 2: Gemini 3 Flash Neural Analysis
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: `
          ACT AS: Hunter AI (Gemini 3 Core). 
          TASK: Forensic Audit of "${businessName}" in "${location}". 
          CONTEXT: ${biz ? 'Entity Found' : 'Entity Invisible/Ghost'}.
          OBJECTIVE: Identify 3 critical Trust Gaps. Rate AI Visibility 0-100.
          OUTPUT: Strict JSON { "score": number, "summary": "string", "truths": ["string"] }` 
        }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 1.0 }
      })
    });

    const aiData = await aiRes.json() as any;
    if (!aiData.candidates) throw new Error("Gemini 3 Link Severed");
    
    return JSON.parse(aiData.candidates[0].content.parts[0].text);

  } catch (e: any) {
    console.error("Gemini 3 Audit Failure", e);
    throw new HttpsError("internal", `Gemini 3 Handshake Failed: ${e.message}`);
  }
});

// --- 2. STRATEGIC CHAT (GEMINI 3 FLASH) ---
export const hunterChat = onCall({ 
  region: "us-central1",
  secrets: ["GEMINI_API_KEY"],
  cors: true
}, async (request) => {
  const { message } = request.data;
  try {
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: `You are Hunter AI, powered by Gemini 3 Flash. User query: "${message}". Respond with strategic, military-grade precision in 1 sentence.` }] }]
      })
    });
    const data = await aiRes.json() as any;
    return { reply: data.candidates[0].content.parts[0].text };
  } catch (e) {
    return { reply: "Gemini 3 Link Unstable. Try again." };
  }
});
