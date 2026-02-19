import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();

// 1. FORENSIC AUDIT (GEMINI 3 FLASH)
export const performAudit = onCall({ 
  region: "us-central1",
  secrets: ["GEMINI_API_KEY", "PLACES_API_KEY"],
  cors: true
}, async (request) => {
  const { businessName, location, clientEmail } = request.data;
  const G_KEY = process.env.GEMINI_API_KEY;
  const P_KEY = process.env.PLACES_API_KEY;

  try {
    // Stage 1: Intelligence Retrieval
    const pRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": P_KEY || "" },
      body: JSON.stringify({ textQuery: `${businessName} in ${location}` })
    });
    const pData = await pRes.json() as any;
    const biz = pData.places?.[0];

    // Stage 2: Gemini 3 Flash Neural Scan
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: `System: Hunter AI (Gemini 3 Core). Task: Forensic Audit for ${businessName}. Local Data: ${biz ? 'Verified' : 'Missing'}. Goal: Highlight 3 invisibility gaps. Output: Strict JSON { "score": number, "summary": "string", "truths": ["string"] }` }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 1.0 }
      })
    });

    const aiData = await aiRes.json() as any;
    if (!aiData.candidates) throw new Error("Gemini 3 Link Severed");
    
    const analysis = JSON.parse(aiData.candidates[0].content.parts[0].text);

    // Stage 3: Trigger Email via Firestore Extension
    await admin.firestore().collection("mail").add({
      to: [clientEmail],
      message: {
        subject: `[Intelligence Report] Entity Status for ${businessName}`,
        html: `
          <h1>Protocol: Digital Entity Scan</h1>
          <p><strong>Target:</strong> ${businessName}</p>
          <hr/>
          <h2>Visibility Score: ${analysis.score} / 100</h2>
          <p><strong>Hunter AI Analysis:</strong> <em>${analysis.summary}</em></p>
          <hr/>
          <h3>Strategic Directive:</h3>
          <p>Your digital entity is vulnerable. The "Ghost Effect" is preventing AI search engines from recommending you. Schedule a counter-intelligence briefing immediately.</p>
          <a href="https://happyhunterdigital.com">Secure Your Entity</a>
          <br/><br/>
          <p><em>End of Transmission. // Happy Hunter Command</em></p>
        `,
      },
    });

    // Return analysis to frontend
    return analysis;

  } catch (e: any) {
    console.error("Gemini 3 Audit Failure", e);
    throw new HttpsError("internal", `Gemini 3 Handshake Failed: ${e.message}`);
  }
});

// 2. STRATEGIC CHAT (Untouched for now)
export const hunterChat = onCall({ 
  region: "us-central1",
  secrets: ["GEMINI_API_KEY"],
  cors: true
}, async (request) => {
  // ... (chatbot logic remains the same)
  return { reply: "Comms jammed. Execute manual outreach." };
});
