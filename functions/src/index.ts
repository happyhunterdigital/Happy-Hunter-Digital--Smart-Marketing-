import { onCall, HttpsError, onRequest } from "firebase-functions/v2/https";
import { onDocumentWritten, onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getPlacesData, scrapeWebsiteSchema, callGeminiAudit, getEmbedding } from "./services/auditService";
import { sendWhatsAppText, sendWhatsAppDoc, sendAdminAlert } from "./services/whatsappService";
import { callGeminiChat } from "./services/chatService";
import { sendTaskNotification } from "./services/taskService";
import { VERIFY_TOKEN, ADMIN_NUMBER, AI_MODEL } from "./config";

admin.initializeApp();
const db = getFirestore();

export const performAudit = onCall({ region: "us-central1", cors: true, timeoutSeconds: 300 }, async (request) => {
  const { businessName, location, clientEmail, whatsapp } = request.data;
  const G_KEY = process.env.GEMINI_API_KEY!;
  const P_KEY = process.env.PLACES_API_KEY!;
  try {
    let pData = await getPlacesData(`${businessName} in ${location}`, P_KEY);
    let biz = pData?.places?.[0] || null;
    const websiteUrl = biz?.websiteUri || null;
    const detectedSchemas = websiteUrl ? await scrapeWebsiteSchema(websiteUrl) : [];
    const prompt = `You are Hunter AI. Audit: ${businessName}. Context: ${JSON.stringify(biz)}. Schemas: ${detectedSchemas.join(', ')}. Format JSON: { "score": number, "summary": "string", "truths": ["string", "string", "string"] }`;
    const aiRes = await callGeminiAudit(prompt, G_KEY);
    const analysis = JSON.parse(aiRes.candidates[0].content.parts[0].text);
    await db.collection("leads").add({ businessName, email: clientEmail, score: analysis.score, timestamp: admin.firestore.FieldValue.serverTimestamp() });
    await sendAdminAlert(businessName, clientEmail, whatsapp, analysis.score);
    return { success: true, ...analysis };
  } catch (e: any) { throw new HttpsError("internal", `Neural Handshake Interrupted. ${e.message}`); }
});

export const hunterChat = onCall({ region: "us-central1", cors: true }, async (request) => {
  const { message, history } = request.data;
  const G_KEY = process.env.GEMINI_API_KEY!;
  try {
    const prompt = `You are Smart Marketing Chat for Happy Hunter Digital using ${AI_MODEL}. Use HTML tags, NO Markdown asterisks.`;
    const formattedHistory = history.map((m: any) => ({ role: m.role === 'bot' ? 'model' : 'user', parts: [{ text: m.text }] }));
    formattedHistory.push({ role: 'user', parts: [{ text: message }] });
    const aiRes = await callGeminiChat(prompt, formattedHistory, G_KEY);
    return { reply: aiRes.candidates[0].content.parts[0].text.trim() };
  } catch (e: any) { return { reply: "Comms offline. Please email motsumitl@happyhunterdigital.com" }; }
});

export const whatsappWebhook = onRequest(async (req, res) => {
  if (req.method === 'GET' && req.query['hub.verify_token'] === VERIFY_TOKEN) { res.status(200).send(req.query['hub.challenge']); return; }
  if (req.method === 'POST') {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (message?.type === 'text') {
      const from = message.from;
      const G_KEY = process.env.GEMINI_API_KEY!;
      const vectorValues = await getEmbedding(message.text.body.toLowerCase(), G_KEY);
      if (vectorValues) {
        const vectorQuery = await db.collection('verified_claims').findNearest('embedding_vector', admin.firestore.FieldValue.vector(vectorValues), { limit: 1, distanceMeasure: 'COSINE' }).get();
        if (!vectorQuery.empty) {
          const data = vectorQuery.docs[0].data();
          if (data.category === 'guide') await sendWhatsAppDoc(from, 'gbp');
          else await sendWhatsAppText(from, data.content || data.verified_answer);
          res.status(200).send('EVENT_RECEIVED'); return;
        }
      }
      await sendWhatsAppText(from, "Handshake Received. How can we assist?");
    }
    res.status(200).send('EVENT_RECEIVED'); return;
  }
  res.status(404).send();
});

export const dailyRevenueReport = onSchedule("every day 08:00", async () => {
  const yesterday = admin.firestore.Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000);
  const snap = await db.collection("leads").where("timestamp", ">", yesterday).get();
  if (snap.size > 0) await sendWhatsAppText(ADMIN_NUMBER, `DAILY REVENUE REPORT\n\nTotal New Leads: ${snap.size}`);
});

export const vectorizeClaim = onDocumentWritten("verified_claims/{docId}", async (event) => {
  const doc = event.data?.after.data();
  if (!doc || !doc.content) return;
  const vectorValues = await getEmbedding(doc.content, process.env.GEMINI_API_KEY!);
  if (vectorValues) await event.data?.after.ref.update({ embedding_vector: admin.firestore.FieldValue.vector(vectorValues) });
});

export const notifyNewTaskAssignment = onDocumentCreated("workspace_tasks/{taskId}", async (event) => {
  const task = event.data?.data();
  if (task?.assigneePhone) await sendTaskNotification(task.assigneePhone, `HQ DIRECTIVE ASSIGNED: ${task.title}`);
});

export const notifyTaskUpdate = onDocumentUpdated("workspace_tasks/{taskId}", async (event) => {
  const newValue = event.data?.after.data();
  const prevValue = event.data?.before.data();
  if (newValue && prevValue && newValue.status !== prevValue.status && newValue.assigneePhone) {
    await sendTaskNotification(newValue.assigneePhone, `STATUS UPDATE: ${newValue.title} is now ${newValue.status}`);
  }
});
