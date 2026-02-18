import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";
import * as dotenv from "dotenv";

dotenv.config();
admin.initializeApp();
const corsHandler = cors({ origin: true });

// Read from process.env (injected via GitHub Actions)
const PLACES_API_KEY = process.env.PLACES_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// 1. Audit Function
export const performAudit = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

    const { businessName, location } = req.body;

    try {
      // Step A: Google Places
      const placesUrl = `https://places.googleapis.com/v1/places:searchText`;
      const placesResponse = await fetch(placesUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": PLACES_API_KEY || "",
          "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.websiteUri"
        },
        body: JSON.stringify({ textQuery: `${businessName} in ${location}` })
      });

      const placesData = await placesResponse.json();
      const place = placesData.places ? placesData.places[0] : null;

      // Step B: Gemini AI
      const entityContext = place 
        ? `Found Entity: ${place.displayName.text}, Rating: ${place.rating} (${place.userRatingCount} reviews), Web: ${place.websiteUri}`
        : `Entity Status: GHOST. No verified Google Maps data found for ${businessName} in ${location}.`;

      const prompt = `
        ACT AS: Hunter AI, digital auditor.
        TARGET: ${businessName} in ${location}.
        DATA: ${entityContext}
        TASK: Analyze their Digital Entity Status. 
        Provide a 0-100 Visibility Score and 3 Brutal Truths.
        FORMAT: JSON object with keys: score (number), summary (string), truths (array of strings).
      `;

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
      const aiResponse = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const aiData = await aiResponse.json();
      const rawText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const analysis = JSON.parse(cleanJson);

      res.status(200).json({ success: true, data: analysis, place: place });

    } catch (error: any) {
      console.error("Audit Error", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

// 2. Chat Function
export const hunterChat = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const { message } = req.body;
    
    const prompt = `
      SYSTEM: You are Hunter AI for Happy Hunter Digital.
      MISSION: Convert visitors into clients.
      TONE: Military-grade precision.
      CONTEXT: User asks: "${message}".
      Provide a strategic response (max 50 words).
    `;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      res.status(200).json({ reply: data.candidates?.[0]?.content?.parts?.[0]?.text || "Signal Lost." });
    } catch (e: any) {
      res.status(500).json({ error: "Comms Link Unstable" });
    }
  });
});
