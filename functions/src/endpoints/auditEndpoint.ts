// functions/src/endpoints/auditEndpoint.ts
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { getPlacesData, scrapeWebsiteSchema, callDeepSeekAudit } from "../services/auditService";
import { sendAdminAlert } from "../services/whatsappService";
import { AI_MODEL, PLACES_API_KEY } from "../config";
import { FieldValue } from "firebase-admin/firestore";

export const performAudit = onCall({
  region: "us-central1",
  cors: true,
  secrets: ["DEEPSEEK_API_KEY"], // EXPLICIT RUNTIME SECRET PERMISSION
  maxInstances: 10,
  timeoutSeconds: 300
}, async (request) => {
  const { businessName, location, clientEmail, whatsapp } = request.data;

  if (!businessName || !location || !clientEmail) throw new HttpsError("invalid-argument", "Missing required fields.");
  if (!PLACES_API_KEY) throw new HttpsError("failed-precondition", "Places API Key offline.");

  try {
    let pData = await getPlacesData(`${businessName} in ${location}`, PLACES_API_KEY);
    let biz = pData?.places?.[0] || null;

    if (!biz) {
      pData = await getPlacesData(businessName, PLACES_API_KEY);
      biz = pData?.places?.[0] || null;
    }

    const websiteUrl = biz?.websiteUri || null;
    const detectedSchemas = websiteUrl ? await scrapeWebsiteSchema(websiteUrl) : [];
    const hasSchema = detectedSchemas.length > 0;

    const schemaString = hasSchema ? `Detected JSON-LD Schemas: ${detectedSchemas.join(", ")}` : "No Schema Markup detected.";
    const bizNameStr = biz?.displayName?.text || "NONE FOUND";
    const context = !biz ? `GHOST ENTITY: No Google Maps data found for "${businessName}". No Website verified. ${schemaString}` : `
      - User Searched For: "${businessName}"
      - Google Maps Returned: "${bizNameStr}"
      - Maps Rating: ${biz.rating || 0} (${biz.userRatingCount || 0} reviews)
      - Website Linked in Maps: ${websiteUrl || 'NONE LINKED'}
      - ${schemaString}`;

    const prompt = `You are Hunter AI powered by ${AI_MODEL}. Audit: ${businessName}. Context: ${context}. SCORING RUBRIC (0-100): Baseline 30. Verified Maps Entity (Names Match Exactly): +20. Rating >= 4.0: +15. Schema Markup Detected (true): +25. Ghost Entity OR No Schema: Deduct 30. If hijacked, set their total score to 0. INSTRUCTIONS FOR 'truths' ARRAY: Truth 1: State if they are Verified, a Ghost, or if a Traffic Hijack occurred. Truth 2: Mention their Website status. Truth 3: Explicitly list the AI Schema Markup found. Format JSON ONLY: {"score": number, "summary": "string", "truths": ["string", "string", "string"]}`;

    const analysis = await callDeepSeekAudit(prompt);

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
