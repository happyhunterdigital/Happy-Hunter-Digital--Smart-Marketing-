import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import axios from "axios";
import * as cheerio from "cheerio";
import { getPlacesData, scrapeWebsiteSchema, callGeminiAudit } from "../services/auditService";
import { sendAdminAlert } from "../services/whatsappService";
import { AI_MODEL } from "../config";
import { FieldValue } from "firebase-admin/firestore";

export const performAudit = onCall({
  region: "us-central1",
  cors: true,
  maxInstances: 10,
  timeoutSeconds: 300
}, async (request) => {
  const { businessName, location, clientEmail, whatsapp } = request.data;
  const G_KEY = process.env.GEMINI_API_KEY;
  const P_KEY = process.env.PLACES_API_KEY;

  if (!businessName || !location || !clientEmail) throw new HttpsError("invalid-argument", "Missing required fields.");
  if (!G_KEY || !P_KEY) throw new HttpsError("failed-precondition", "AI Core Offline.");

  try {
    let pData = await getPlacesData(`${businessName} in ${location}`, P_KEY);
    let biz = pData?.places?.[0] || null;

    if (!biz) {
      pData = await getPlacesData(businessName, P_KEY);
      biz = pData?.places?.[0] || null;
    }

    const websiteUrl = biz?.websiteUri || null;
    let detectedSchemas: string[] = [];
    let hasSchema = false;

    if (websiteUrl) {
      try {
        const webRes = await axios.get(websiteUrl, {
          timeout: 6000,
          headers: { "User-Agent": "Mozilla/5.0" }
        });
        const $ = cheerio.load(webRes.data);
        $('script[type="application/ld+json"]').each((_, element) => {
          hasSchema = true;
          try {
            const jsonData = JSON.parse($(element).html() || "{}");
            const extractType = (obj: any) => {
              if (!obj) return;
              if (Array.isArray(obj)) {
                obj.forEach(extractType);
              } else if (typeof obj === 'object') {
                if (obj['@type']) detectedSchemas.push(obj['@type']);
                if (obj['@graph']) extractType(obj['@graph']);
              }
            };
            extractType(jsonData);
          } catch(e) { }
        });
        detectedSchemas = [...new Set(detectedSchemas)];
        if (detectedSchemas.length === 0 && hasSchema) detectedSchemas = ["Valid Schema (Unknown Type)"];
      } catch (err) {
        console.log("Web scrape failed or timed out for:", websiteUrl);
      }
    }

    const schemaString = detectedSchemas.length > 0 ? `Detected JSON-LD Schemas: ${detectedSchemas.join(", ")}` : "No Schema Markup detected.";
    const bizNameStr = biz?.displayName?.text || "NONE FOUND";
    const context = !biz ? `GHOST ENTITY: No Google Maps data found for "${businessName}". No Website verified. ${schemaString}` : `
      - User Searched For: "${businessName}"
      - Google Maps Returned: "${bizNameStr}"
      - Maps Rating: ${biz.rating || 0} (${biz.userRatingCount || 0} reviews)
      - Website Linked in Maps: ${websiteUrl || 'NONE LINKED'}
      - ${schemaString}`;

    const prompt = `You are Hunter AI powered by ${AI_MODEL}. Audit: ${businessName}. Context: ${context}. SCORING RUBRIC (0-100): Baseline 30. Verified Maps Entity (Names Match Exactly): +20. Rating >= 4.0: +15. Schema Markup Detected (true): +25. Ghost Entity OR No Schema: Deduct 30. If hijacked, set their total score to 0. INSTRUCTIONS FOR 'truths' ARRAY: Truth 1: State if they are Verified, a Ghost, or if a Traffic Hijack occurred. Truth 2: Mention their Website status. Truth 3: Explicitly list the AI Schema Markup found. Format JSON ONLY: {"score": number, "summary": "string", "truths": ["string", "string", "string"]}`;

    const aiRes = await callGeminiAudit(prompt, G_KEY);
    if (aiRes.error) throw new Error(aiRes.error.message);
    
    let textContent = aiRes?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textContent) throw new Error("AI core returned empty payload.");
    
    textContent = textContent.replace(/```json/gi, "").replace(/```/g, "").trim();
    const analysis = JSON.parse(textContent);

    const isHijacked = (biz && analysis.score === 0);
    const telemetry = {
      mapsStatus: !biz ? "GHOST (NOT FOUND)" : isHijacked ? "HIJACKED (COMPETITOR FOUND)" : "VERIFIED",
      website: websiteUrl || "None Linked",
      schema: hasSchema,
      schemasDetected: detectedSchemas
    };

    const db = admin.firestore();
    await db.collection("leads").add({ businessName, email: clientEmail, whatsapp: whatsapp || null, score: analysis.score, timestamp: FieldValue.serverTimestamp() });
    
    const isGoodScore = analysis.score >= 70;
    const emailHtml = `<div style="font-family: Arial, sans-serif; background-color: #050505; color: #fff; padding: 40px; text-align: center;">
      <h1 style="color: ${isGoodScore ? '#22c55e' : '#eab308'};">Digital Survival Score: ${analysis.score}/100</h1><p>${analysis.summary}</p></div>`;

    await db.collection("mail").add({ to: [clientEmail], message: { subject: `[Intelligence Report] Status: ${businessName}`, html: emailHtml } });
    
    sendAdminAlert(businessName, clientEmail, whatsapp, analysis.score).catch(() => {});

    return { success: true, ...analysis, telemetry };

  } catch (e: any) {
    throw new HttpsError("internal", `Neural Handshake Interrupted. ${e.message}`);
  }
});
