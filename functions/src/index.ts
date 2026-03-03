import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import axios from "axios";
import * as cheerio from "cheerio";

admin.initializeApp();
const db = getFirestore();

// ==========================================
// 1. FULL DIGITAL FOOTPRINT AUDIT (INDESTRUCTIBLE)
// ==========================================
export const performAudit = onCall({
  region: "us-central1",
  cors: true,
  maxInstances: 10,
  timeoutSeconds: 300
}, async (request) => {
  const { businessName, location, clientEmail } = request.data;
  const G_KEY = process.env.GEMINI_API_KEY;
  const P_KEY = process.env.PLACES_API_KEY;

  if (!businessName || !location || !clientEmail) throw new HttpsError("invalid-argument", "Missing required fields.");
  if (!G_KEY || !P_KEY) throw new HttpsError("failed-precondition", "AI Core Offline. Missing API Keys.");

  try {
    // 1. Fetch Google Maps Data
    const pRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "X-Goog-Api-Key": P_KEY,
        "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri" 
      },
      body: JSON.stringify({ textQuery: `${businessName} in ${location}` })
    });

    const pData = await pRes.json() as any;

    if (!pRes.ok || pData.error) {
        return {
            success: true,
            score: 0,
            summary: `SYSTEM DIAGNOSTIC: Google API Handshake Failed. Code: ${pData.error?.code || 'Unknown'}`,
            truths: ["Google Places API Rejected Connection", "Check API Key Restrictions", "Verify Google Cloud Billing"]
        };
    }

    // Safely extract business if it exists
    const biz = pData.places && pData.places.length > 0 ? pData.places[0] : null;
    const websiteUrl = biz?.websiteUri;

    // 2. The Web Scraper (Protected by Fallback Architecture & Regex Cleaning)
    let webScrapeData = "No website found on Google Maps.";
    let hasSchema = false;

    if (websiteUrl) {
      try {
        const webRes = await axios.get(websiteUrl, { timeout: 5000 });
        const $ = cheerio.load(webRes.data);
        if ($('script[type="application/ld+json"]').length > 0) hasSchema = true;
        
        // Clean text aggressively to prevent Gemini safety filters from blocking weird characters
        const bodyText = $('body').text().replace(/[^a-zA-Z0-9.,!? ]/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 1000);
        webScrapeData = `Website active (${websiteUrl}). Schema Markup Detected: ${hasSchema}. Content: ${bodyText}`;
      } catch (err) {
        webScrapeData = `Website listed (${websiteUrl}) but our scanner was blocked.`;
      }
    }

    // 3. Compile Full Context for Gemini
    const context = biz
      ? `Verified Maps Entity: ${biz.displayName?.text}. Rating: ${biz.rating}. Reviews: ${biz.userRatingCount}. WEB DATA: ${webScrapeData}`
      : `Ghost Entity: No Maps data found via strict API search for "${businessName}". WEB DATA: ${webScrapeData}`;

    // 4. The Upgraded Scoring Rubric
    const RUBRIC = `
      SCORING RUBRIC (0-100):
      - Start at baseline 30.
      - If Verified Maps Entity, add 20 points.
      - If rating is 4.0 or higher, add 15 points.
      - If Schema Markup is true, add 20 points.
      - If Ghost Entity, deduct 30 points.
    `;

    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: `You are Hunter AI. Audit this business: ${businessName}. Data Context: ${context}. ${RUBRIC} No asterisks. Format JSON: { "score": number, "summary": "string", "truths": ["string", "string", "string"] }` }] 
        }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
      })
    });

    const aiData = await aiRes.json() as any;

    // FAIL-SAFE: Intercept Gemini crashes (Safety Blocks, Quota limits, API errors)
    if (!aiData.candidates || !aiData.candidates[0].content?.parts[0]?.text) {
        return {
            success: true,
            score: biz ? 45 : 0,
            summary: `SYSTEM DIAGNOSTIC: Gemini AI Neural Link Failed. The LLM blocked the request or timed out.`,
            truths: [
                `Maps Data Found: ${biz ? 'Yes' : 'No'}`,
                "Gemini Payload Empty",
                `Block Reason: ${aiData.promptFeedback?.blockReason || 'Unknown API Failure'}`
            ]
        };
    }

    let analysis;
    try {
        analysis = JSON.parse(aiData.candidates[0].content.parts[0].text);
    } catch (parseError) {
        return {
            success: true,
            score: 50,
            summary: "SYSTEM DIAGNOSTIC: Gemini returned invalid JSON format. Manual override required.",
            truths: ["JSON Parsing Failed", "AI Hallucination Detected", "Retry Audit"]
        };
    }

    await db.collection("leads").add({ 
      businessName, 
      email: clientEmail, 
      score: analysis.score, 
      timestamp: admin.firestore.FieldValue.serverTimestamp() 
    });

    const isGoodScore = analysis.score >= 70;
    const isBadScore = analysis.score < 50;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background-color: #050505; padding: 40px; border-radius: 16px; border: 1px solid #1f2937;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #eab308; margin: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 14px;">Smart Marketing Engine</h2>
          <h1 style="color: #ffffff; margin: 10px 0 0 0; text-transform: uppercase;">Full Digital Footprint Report</h1>
        </div>
        <div style="background-color: #0a0a0a; border: 1px solid #1f2937; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
          <p style="color: #9ca3af; margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Target Entity</p>
          <p style="color: #ffffff; margin: 0; font-size: 18px; font-weight: bold;">${businessName}</p>
          <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">${location}</p>
        </div>
        <div style="text-align: center; margin-bottom: 40px;">
          <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Visibility Score</p>
          <div style="font-size: 72px; font-weight: 900; line-height: 1; color: ${isGoodScore ? '#22c55e' : isBadScore ? '#ef4444' : '#eab308'};">
            ${analysis.score}<span style="font-size: 24px; color: #4b5563;">/100</span>
          </div>
        </div>
        <div style="margin-bottom: 30px;">
          <h3 style="color: #eab308; margin: 0 0 15px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Forensic AI Summary</h3>
          <p style="color: #ffffff; margin: 0; font-size: 16px; line-height: 1.6; font-style: italic; border-left: 3px solid #eab308; padding-left: 15px;">"${analysis.summary}"</p>
        </div>
        <div style="margin-bottom: 40px;">
          <h3 style="color: #ef4444; margin: 0 0 15px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Specific Technical Weak Spots</h3>
          ${analysis.truths.map((truth: string, index: number) => `
            <div style="background-color: #111827; border: 1px solid #1f2937; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
              <span style="color: #eab308; font-weight: bold; margin-right: 10px;">0${index + 1}</span>
              <span style="color: #d1d5db; font-size: 14px;">${truth}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    await db.collection("mail").add({
      to: [clientEmail],
      message: {
        subject: `[Intelligence Report] Status: ${businessName}`,
        html: emailHtml,
      }
    });

    return { success: true, ...analysis };
  } catch (e: any) {
    console.error("Critical Runtime Error:", e);
    throw new HttpsError("internal", `System Engine Failed to Compile Data.`);
  }
});

// ==========================================
// 2. STRATEGIC CHAT (UNCHANGED / STABLE)
// ==========================================
export const hunterChat = onCall({
  region: "us-central1",
  cors: true,
}, async (request) => {
  const { message, history = [] } = request.data;
  const G_KEY = process.env.GEMINI_API_KEY;

  if (!message || !G_KEY) return { reply: "Connection offline. Missing parameters." };

  const SYSTEM_PROMPT = `You are Hunter AI, the official digital marketing assistant for Happy Hunter Digital (also known as Happy Hunter Systems).
  YOUR KNOWLEDGE BASE:
  - Founder & Head Strategist: Thabo Leslie Motsumi.
  - Our Mission: We stop South African SMEs from being "Ghosts" to AI algorithms. We turn physical businesses into digital powerhouses.
  - Our Services: 1) Trust Synchronization (Google Maps, NAP consistency). 2) AI Visibility (AEO, Schema markup for ChatGPT/Gemini). 3) Agentic Revenue (Automated lead capture).
  - Our Tool: The "Smart Marketing Scan" (provides a Digital Survival Score). Contact: WhatsApp +27 (0) 60 101 6673 or email motsumitl@happyhunterdigital.com. Website: www.happyhunterdigital.com
  - Upcoming Event: We are speaking at the Integrated Wellth Summit on 28 Feb in Waterfall City.

  RULES:
  1. NEVER make up information. Use ONLY the Knowledge Base.
  2. If someone asks who the founder is, say "Thabo Leslie Motsumi".
  3. Be direct, professional, and slightly authoritative.
  4. COMPLETE YOUR SENTENCES. Do not trail off.
  5. Keep answers to 2-3 sentences max.`;

  const formattedHistory = history.map((msg: any) => ({
    role: msg.role === 'bot' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));
  formattedHistory.push({ role: "user", parts: [{ text: message }] });

  try {
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: formattedHistory,
        generationConfig: { temperature: 0.1, maxOutputTokens: 500 }
      })
    });

    if (!aiRes.ok) return { reply: "My neural link is currently overloaded. Please email HQ." };

    const data = await aiRes.json() as any;
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return { reply: data.candidates[0].content.parts[0].text.trim() };
    } else {
      return { reply: "I received an unreadable signal from the core. Try again." };
    }
  } catch (e) {
    return { reply: "Comms offline. Please email motsumitl@happyhunterdigital.com" };
  }
});
