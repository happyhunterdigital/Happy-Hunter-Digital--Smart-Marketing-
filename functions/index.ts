import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";

admin.initializeApp();
const corsHandler = cors({ origin: true });

// --- CONFIGURATION ---
// Set these in Firebase via CLI or Google Cloud Console
// firebase functions:config:set google.places_key="YOUR_KEY" google.gemini_key="YOUR_KEY"
const PLACES_API_KEY = functions.config().google?.places_key || process.env.PLACES_API_KEY;
const GEMINI_API_KEY = functions.config().google?.gemini_key || process.env.GEMINI_API_KEY;

// --- 1. SECURE AUDIT FUNCTION ---
export const performAudit = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

    const { businessName, location } = req.body;

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
        
        TASK: Analyze their Digital Entity Status. 
        1. If "GHOST" status, explain the danger of non-existence in AI search.
        2. If found, critique their rating/reviews volume vs competitors.
        3. Provide a 0-100 Visibility Score.
        4. Give 3 Brutal Truths about their current SEO.
        
        FORMAT: JSON object with keys: score (number), summary (string), truths (array of strings).
      `;

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
      const aiResponse = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const aiData = await aiResponse.json();
      const rawText = aiData.candidates[0].content.parts[0].text;
      
      // Clean up JSON markdown if Gemini adds it
      const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const analysis = JSON.parse(cleanJson);

      res.status(200).json({ success: true, data: analysis, place: place });

    } catch (error: any) {
      console.error("Audit Error", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

// --- 2. SECURE CHAT FUNCTION ---
export const hunterChat = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const { message, history } = req.body;
    
    const prompt = `
      SYSTEM: You are Hunter AI, the strategic interface for Happy Hunter Digital.
      MISSION: Convert visitors into clients by diagnosing their "Digital Invisibility".
      TONE: Professional, succinct, military-grade precision.
      CONTEXT: User is asking: "${message}".
      
      Provide a helpful, strategic response (max 50 words). Encourages them to run the Audit Tool.
    `;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } catch (e: any) {
      res.status(500).json({ error: "Comms Link Unstable" });
    }
  });
});
