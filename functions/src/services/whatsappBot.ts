import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { VERIFY_TOKEN, ADMIN_NUMBER, AI_MODEL } from "../config";
import { getEmbedding } from "./auditService";
import { sendWhatsAppText, sendWhatsAppDoc } from "./whatsappService";
import { callGeminiChat } from "./chatService";
import { FieldValue } from "firebase-admin/firestore";

export const whatsappWebhook = onRequest(async (req, res) => {
  if (req.method === 'GET' && req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.status(200).send(req.query['hub.challenge']);
    return;
  }

  if (req.method === 'POST') {
    const db = admin.firestore();
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    
    if (message?.type === 'text') {
      const from = message.from;
      const userText = message.text.body;
      const G_KEY = process.env.GEMINI_API_KEY;
      
      if (!G_KEY) {
        await sendWhatsAppText(from, "Neural link is offline. Please try again later.");
        res.status(200).send('EVENT_RECEIVED');
        return;
      }

      try {
        // 1. Check Vector DB for verified hard-claims (Guides, Pricing)
        const vectorValues = await getEmbedding(userText.toLowerCase(), G_KEY);
        if (vectorValues && !vectorValues.error) {
          const vectorQuery = await db.collection('verified_claims').findNearest('embedding_vector', FieldValue.vector(vectorValues), { limit: 1, distanceMeasure: 'COSINE' }).get();
          if (!vectorQuery.empty) {
            const data = vectorQuery.docs[0].data();
            if (data.category === 'guide') {
              await sendWhatsAppDoc(from, 'gbp');
              res.status(200).send('EVENT_RECEIVED');
              return;
            }
          }
        }

        // 2. Fetch Chat History to make the LLM stateful
        const sessionRef = db.collection('whatsapp_sessions').doc(from);
        const sessionDoc = await sessionRef.get();
        let history = sessionDoc.exists ? sessionDoc.data()?.history || [] : [];

        // 3. Format LLM Payload
        const systemPrompt = `You are the Official AI Assistant for Happy Hunter Digital using ${AI_MODEL}. 
        Keep answers short, professional, and friendly. NO markdown asterisks. 
        SERVICES: 
        - Tier 1 Essential (R9,950/mo): 3-5 page site, GBP Optimization, Q&A Seeding, Basic WA Bot.
        - Tier 2 Comprehensive (R19,950/mo): AEO Content, Advanced JSON-LD, 3 WA flows.
        - Tier 3 Premium (R39,950/mo): Deep build, AI Voice Agents, Predictive Analytics.
        STANDALONE: GBP Setup & Verification (R2,950), AI Visibility Audit (R3,950), WA API Setup (R7,950).
        If users want an audit, tell them to visit happyhunterdigital.com/audit.`;

        const formattedHistory = history.map((m: any) => ({
          role: m.role === 'bot' ? 'model' : 'user',
          parts: [{ text: m.text }]
        }));

        formattedHistory.push({ role: 'user', parts: [{ text: userText }] });

        // 4. Call Neural Core
        const aiRes = await callGeminiChat(systemPrompt, formattedHistory, G_KEY);
        if (aiRes.error) throw new Error(aiRes.error.message);
        
        const replyText = aiRes?.candidates?.[0]?.content?.parts?.[0]?.text;
        const finalMessage = replyText ? replyText.replace(/\*/g, '').trim() : "I am processing a heavy load right now. Let's talk later.";

        // 5. Save State & Send
        history.push({ role: 'user', text: userText });
        history.push({ role: 'bot', text: finalMessage });
        if (history.length > 10) history = history.slice(history.length - 10);
        
        await sessionRef.set({ history, lastUpdated: FieldValue.serverTimestamp() });
        await sendWhatsAppText(from, finalMessage);

      } catch (err) {
        console.error("WA LLM Error:", err);
        await sendWhatsAppText(from, "The neural core is recalibrating. Please hold.");
      }
    }
    res.status(200).send('EVENT_RECEIVED');
    return;
  }
  res.status(404).send();
});
