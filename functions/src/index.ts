// functions/src/index.ts
import { setGlobalOptions } from "firebase-functions/v2";
import { onCall, HttpsError, onRequest } from "firebase-functions/v2/https";
import { onDocumentWritten, onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";

import { getPlacesData, scrapeWebsiteSchema, callGeminiAudit, getEmbedding } from "./services/auditService";
import { sendWhatsAppText, sendWhatsAppDoc, sendAdminAlert } from "./services/whatsappService";
import { callGeminiChat } from "./services/chatService";
import { sendTaskNotification } from "./services/taskService";
import { VERIFY_TOKEN, ADMIN_NUMBER, AI_MODEL } from "./config";

// 1. SURGICAL FIX: Allocate sufficient memory to prevent "Resource readiness deadline exceeded"
// Gen 2 functions (Cloud Run) often time out on boot with the default 256MB when loading the Admin SDK.
setGlobalOptions({
  region: "us-central1",
  memory: "512MiB",
  timeoutSeconds: 300,
  maxInstances: 10
});

let db: admin.firestore.Firestore;
try {
  const app = admin.initializeApp();
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase Admin Init Error:", error);
  db = getFirestore();
}

// ============================================================================
// 1. SMART MARKETING AUDIT
// ============================================================================
export const performAudit = onCall(async (request) => {
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

    const textContent = aiRes?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textContent) throw new Error("Empty AI response");

    const analysis = JSON.parse(textContent);

    await db.collection("leads").add({
      businessName,
      email: clientEmail,
      whatsapp: whatsapp || null,
      score: analysis.score,
      timestamp: FieldValue.serverTimestamp()
    });

    await sendAdminAlert(businessName, clientEmail, whatsapp, analysis.score);

    return { success: true, ...analysis };
  } catch (e: any) {
    console.error("Audit Function Error:", e);
    throw new HttpsError("internal", `Neural Handshake Interrupted. ${e.message}`);
  }
});

// ============================================================================
// 2. STRATEGIC CHATBOT
// ============================================================================
export const hunterChat = onCall(async (request) => {
  const { message, history } = request.data;
  const G_KEY = process.env.GEMINI_API_KEY;

  if (!message || !G_KEY) {
    return { reply: "Connection offline. Missing parameters." };
  }

  const SYSTEM_PROMPT = `You are Smart Marketing Chat for Happy Hunter Digital using ${AI_MODEL}. Use HTML tags, NO Markdown asterisks. Founder: Thabo Motsumi. Mission: Stop SA SMEs from being Ghosts to AI. Primary Tool: happyhunterdigital.com/audit. Contact: WhatsApp +27(0) 60 101 6673.`;

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

// ============================================================================
// 3. WHATSAPP WEBHOOK
// ============================================================================
export const whatsappWebhook = onRequest(async (req, res) => {
  if (req.method === 'GET' && req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.status(200).send(req.query['hub.challenge']);
    return;
  }

  if (req.method === 'POST') {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (message?.type === 'text') {
      const from = message.from;
      const G_KEY = process.env.GEMINI_API_KEY;
      
      if (G_KEY) {
        const vectorValues = await getEmbedding(message.text.body.toLowerCase(), G_KEY);
        if (vectorValues) {
          const vectorQuery = await db.collection('verified_claims').findNearest('embedding_vector', FieldValue.vector(vectorValues), { limit: 1, distanceMeasure: 'COSINE' }).get();
          if (!vectorQuery.empty) {
            const data = vectorQuery.docs[0].data();
            if (data.category === 'guide') await sendWhatsAppDoc(from, 'gbp');
            else await sendWhatsAppText(from, data.content || data.verified_answer);
            res.status(200).send('EVENT_RECEIVED');
            return;
          }
        }
      }
      await sendWhatsAppText(from, "Handshake Received. How can we assist?");
    }
    res.status(200).send('EVENT_RECEIVED');
    return;
  }
  res.status(404).send();
});

// ============================================================================
// 4. DAILY REVENUE REPORT
// ============================================================================
export const dailyRevenueReport = onSchedule("every day 08:00", async () => {
  const yesterday = Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000);
  const snap = await db.collection("leads").where("timestamp", ">", yesterday).get();
  if (snap.size > 0) {
    await sendWhatsAppText(ADMIN_NUMBER, `DAILY REVENUE REPORT\n\nTotal New Leads: ${snap.size}`);
  }
});

// ============================================================================
// 5. VECTORIZE CLAIM (Auto-Embed on Firestore Write)
// ============================================================================
export const vectorizeClaim = onDocumentWritten("verified_claims/{docId}", async (event) => {
  const doc = event.data?.after.data();
  if (!doc || !doc.content) return;
  const G_KEY = process.env.GEMINI_API_KEY;
  if (G_KEY) {
    const vectorValues = await getEmbedding(doc.content, G_KEY);
    if (vectorValues) {
      await event.data?.after.ref.update({ embedding_vector: FieldValue.vector(vectorValues) });
    }
  }
});

// ============================================================================
// 6. TASK NOTIFICATIONS
// ============================================================================
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
