import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";
import * as dotenv from "dotenv";

dotenv.config();
admin.initializeApp();
const corsHandler = cors({ origin: true });

const PLACES_API_KEY = (process.env.PLACES_API_KEY || "").trim();
const GEMINI_API_KEY = (process.env.GEMINI_API_KEY || "").trim();

// 1. AUDIT PROTOCOL
export const performAudit = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST") return res.status(405).send("Forbidden");
    const { businessName, location } = req.body;

    try {
      // Data Extraction (Google Places)
      const pRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": PLACES_API_KEY,
          "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri,places.businessStatus"
        },
        body: JSON.stringify({ textQuery: `${businessName} in ${location}` })
      });
      const pData = await pRes.json() as any;
      const biz = pData.places?.[0];

      const context = biz 
        ? `VERIFIED: ${biz.displayName?.text}. Rating: ${biz.rating}. Reviews: ${biz.userRatingCount}. Status: ${biz.businessStatus}.`
        : `GHOST: No Maps data found for "${businessName}" in ${location}.`;

      // Intelligence Generation (Gemini Flash Latest)
      const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contents: [{ parts: [{ text: `You are Hunter AI. Perform a Digital Audit on: ${businessName}. Context: ${context}. Rate 0-100. Provide 3 specific gaps. Format: Strict JSON { "score": number, "summary": "string", "truths": ["string"] }` }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.2 }
        })
      });

      const aiData = await aiRes.json() as any;
      const analysis = JSON.parse(aiData.candidates[0].content.parts[0].text);
      res.status(200).json({ success: true, data: analysis, place: biz });

    } catch (e: any) {
      res.status(500).json({ success: false, error: "System Breach: Handshake Failed" });
    }
  });
});

// 2. CHAT PROXY
export const hunterChat = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const { message } = req.body;
    try {
      const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contents: [{ parts: [{ text: `You are Hunter AI, strategic assistant for Happy Hunter Digital. Direct and authoritative. User says: ${message}. Respond in 1-2 sentences.` }] }]
        })
      });
      const data = await aiRes.json() as any;
      res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } catch (e) {
      res.status(500).json({ error: "Comms Offline" });
    }
  });
});
