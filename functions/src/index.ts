import { onCall, HttpsError, onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getPlacesData, scrapeWebsiteSchema, callGeminiAudit } from "./services/auditService";
import { sendWhatsAppText, sendAdminAlert } from "./services/whatsappService";
import { callGeminiChat } from "./services/chatService";
import { AI_MODEL } from "./config";

admin.initializeApp();
const db = getFirestore();

export const performAudit = onCall({
  region: "us-central1",
  cors: true,
  timeoutSeconds: 300
}, async (request) => {
  const { businessName, location, clientEmail, whatsapp } = request.data;
  const G_KEY = process.env.GEMINI_API_KEY;
  const P_KEY = process.env.PLACES_API_KEY;

  if (!businessName || !location || !clientEmail) {
    throw new HttpsError("invalid-argument", "Missing required fields.");
  }
  if (!G_KEY || !P_KEY) {
    throw new HttpsError("failed-precondition", "AI Core Offline. Check secrets.");
  }

  try {
    let pData = await getPlacesData(`${businessName} in ${location}`, P_KEY);
    let biz = pData?.places?.[0] || null;

    if (!biz) {
      pData = await getPlacesData(businessName, P_KEY);
      biz = pData?.places?.[0] || null;
    }

    const websiteUrl = biz?.websiteUri || null;
    const detectedSchemas = websiteUrl ? await scrapeWebsiteSchema(websiteUrl) : [];
    const bizNameStr = biz?.displayName?.text || "NONE FOUND";

    const context = !biz
      ? `GHOST ENTITY: No Google Maps data found for "${businessName}".`
      : `Maps Returned: "${bizNameStr}" | Rating: ${biz.rating || 0} | Website: ${websiteUrl || 'NONE'} | Schemas: ${detectedSchemas.join(",")}`;

    const aiRes = await callGeminiAudit(`You are Hunter AI. Audit: ${businessName}. Context: ${context}. Format JSON: {"score": number, "summary": "string", "truths": ["string", "string", "string"]}`, G_KEY);

    // Safe parsing of AI response
    const textContent = aiRes?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textContent) throw new Error("Empty AI response");

    const analysis = JSON.parse(textContent);

    await db.collection("leads").add({
      businessName,
      email: clientEmail,
      whatsapp: whatsapp || null,
      score: analysis.score,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    await sendAdminAlert(businessName, clientEmail, whatsapp, analysis.score);

    return { success: true, ...analysis };
  } catch (e: any) {
    console.error("Audit Function Error:", e);
    throw new HttpsError("internal", `Neural Handshake Interrupted. ${e.message}`);
  }
});

export const hunterChat = onCall({
  region: "us-central1",
  cors: true,
}, async (request) => {
  const { message, history } = request.data;
  const G_KEY = process.env.GEMINI_API_KEY;

  if (!message || !G_KEY) {
    return { reply: "Connection offline. Missing parameters." };
  }

  const SYSTEM_PROMPT = `You are Smart Marketing Chat, the official digital marketing AI assistant for Happy Hunter Digital. Use HTML tags, NO Markdown asterisks. Model: ${AI_MODEL}.`;

  try {
    const formattedHistory = (history || []).map((m: any) => ({
      role: m.role === 'bot' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));
    formattedHistory.push({ role: 'user', parts: [{ text: message }] });

    const aiRes = await callGeminiChat(SYSTEM_PROMPT, formattedHistory, G_KEY);
    
    const replyText = aiRes?.candidates?.[0]?.content?.parts?.[0]?.text;
    return { reply: replyText ? replyText.trim() : "Signal unreadable." };
  } catch (e: any) {
    console.error("Chat Function Error:", e);
    return { reply: "Comms offline. Please email motsumitl@happyhunterdigital.com" };
  }
});
