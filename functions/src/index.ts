import { onCall, HttpsError, onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getPlacesData, scrapeWebsiteSchema, callGeminiAudit } from "./services/auditService";
import { sendWhatsAppText, sendWhatsAppDoc } from "./services/whatsappService";
import { VERIFY_TOKEN } from "./config";

admin.initializeApp();
const db = getFirestore();

export const performAudit = onCall({ region: "us-central1", cors: true, timeoutSeconds: 300 }, async (request) => {
  const { businessName, location, clientEmail } = request.data;
  const G_KEY = process.env.GEMINI_API_KEY!;
  const P_KEY = process.env.PLACES_API_KEY!;

  try {
    let pData = await getPlacesData(`${businessName} in ${location}`, P_KEY);
    let biz = pData?.places?.[0] || null;
    const websiteUrl = biz?.websiteUri || null;
    const detectedSchemas = websiteUrl ? await scrapeWebsiteSchema(websiteUrl) : [];
    
    const prompt = `Perform Audit for ${businessName}. Context: ${JSON.stringify(biz)}. Schemas: ${detectedSchemas.join(', ')}`;
    const aiRes = await callGeminiAudit(prompt, G_KEY);
    const analysis = JSON.parse(aiRes.candidates[0].content.parts[0].text);

    await db.collection("leads").add({ businessName, email: clientEmail, score: analysis.score, timestamp: admin.firestore.FieldValue.serverTimestamp() });
    return { success: true, ...analysis };
  } catch (e: any) {
    throw new HttpsError("internal", e.message);
  }
});

export const whatsappWebhook = onRequest(async (req, res) => {
  if (req.method === 'GET' && req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.status(200).send(req.query['hub.challenge']);
    return;
  }
  if (req.method === 'POST') {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (message?.type === 'text') {
      const userText = message.text.body.toLowerCase();
      if (userText.includes('guide')) await sendWhatsAppDoc(message.from, 'gbp');
      else await sendWhatsAppText(message.from, "Handshake Received. How can we assist?");
    }
    res.status(200).send('EVENT_RECEIVED');
    return;
  }
  res.status(404).send();
});
