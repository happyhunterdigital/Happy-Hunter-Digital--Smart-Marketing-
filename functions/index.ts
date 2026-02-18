import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";
import * as dotenv from "dotenv";
import fetch from "node-fetch"; // Ensure node-fetch is used

dotenv.config();
admin.initializeApp();
const corsHandler = cors({ origin: true });

// Sanitize keys (remove accidental newlines)
const PLACES_API_KEY = process.env.PLACES_API_KEY ? process.env.PLACES_API_KEY.trim() : "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";

export const performAudit = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

    const { businessName, location } = req.body;
    console.log(`[AUDIT REQUEST] ${businessName} in ${location}`);

    if (!PLACES_API_KEY || !GEMINI_API_KEY) {
      console.error("MISSING API KEYS in Runtime Environment");
      res.status(500).json({ success: false, error: "Server Configuration Error: Missing Keys" });
      return;
    }

    try {
      // Step A: Real Intelligence (Google Places)
      const placesUrl = `https://places.googleapis.com/v1/places:searchText`;
      const placesResponse = await fetch(placesUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": PLACES_API_KEY,
          "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.websiteUri"
        },
        body: JSON.stringify({ textQuery: `${businessName} in ${location}` })
      });

      if (!placesResponse.ok) {
        const errText = await placesResponse.text();
        console.error("Google Places API Error:", placesResponse.status, errText);
        throw new Error(`Google Maps Lookup Failed: ${placesResponse.status}`);
      }

      const placesData = await placesResponse.json();
      const place = placesData.places ? placesData.places[0] : null;

      // Step B: AI Analysis (Gemini)
      const entityContext = place 
        ? `Found Entity: ${place.displayName.text}, Rating: ${place.rating} (${place.userRatingCount} reviews), Web: ${place.websiteUri}`
        : `Entity Status: GHOST. No verified Google Maps data found for ${businessName} in ${location}.`;

      const prompt = `
        ACT AS: Hunter AI, a ruthless digital entity auditor.
        TARGET: ${businessName} in ${location}.
        DATA: ${entityContext}
        TASK: Analyze Digital Entity Status. 
        FORMAT: JSON object with keys: score (number 0-100), summary (string), truths (array of 3 strings).
      `;

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
      const aiResponse = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      if (!aiResponse.ok) {
        const errText = await aiResponse.text();
        console.error("Gemini API Error:", aiResponse.status, errText);
        throw new Error(`AI Analysis Failed: ${aiResponse.status}`);
      }

      const aiData = await aiResponse.json();
      // Safe parsing
      const rawText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      
      let analysis;
      try {
        analysis = JSON.parse(cleanJson);
      } catch (e) {
        console.error("JSON Parse Error:", rawText);
        analysis = { score: 50, summary: "Analysis complete but unformatted.", truths: ["Manual review required."] };
      }

      res.status(200).json({ success: true, data: analysis, place: place });

    } catch (error: any) {
      console.error("Audit Critical Failure:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

export const hunterChat = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const { message } = req.body;
    
    if (!GEMINI_API_KEY) {
       res.status(500).json({ error: "System Offline (Config)" });
       return;
    }

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
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Signal Lost.";
      res.status(200).json({ reply });
    } catch (e: any) {
      console.error("Chat Error:", e);
      res.status(500).json({ error: "Comms Link Unstable" });
    }
  });
});
