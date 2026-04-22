import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import axios from "axios";
import { VERIFY_TOKEN, ADMIN_NUMBER, AI_MODEL, PHONE_NUMBER_ID, WHATSAPP_TOKEN, GEMINI_API_KEY } from "../config";
import { callGeminiChat } from "./chatService";
import { FieldValue } from "firebase-admin/firestore";
import { sendWhatsAppDoc } from "./whatsappService";

export const whatsappWebhook = onRequest(async (req, res) => {
  if (req.method === 'GET') {
    if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
      res.status(200).send(req.query['hub.challenge']);
    } else {
      res.status(403).send('Verification failed');
    }
    return;
  }

  if (req.method === 'POST') {
    const db = admin.firestore();
    
    if (req.body?.object === 'whatsapp_business_account') {
      const entry = req.body.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;
      const message = value?.messages?.[0];

      // 1. ONBOARDING LOGIC
      if (message?.type === "system" && message.system?.type === "group_membership_change") {
        const newUser = message.from;
        const onboardingDoc = await db.collection("verified_claims").where("category", "==", "onboarding").limit(1).get();
        
        if (!onboardingDoc.empty) {
          const data = onboardingDoc.docs[0].data();
          const welcomeMessage = `Welcome to the Smart Marketing Tribe! 🚀\n\nWe are excited to have you.\n${data.content}\n\nIntroduce yourself once you're in!`;
          
          try {
            await axios.post(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
              messaging_product: "whatsapp", to: newUser, text: { body: welcomeMessage }
            }, { headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}` } });
          } catch (err) { 
            console.error("Onboarding Error", err); 
          }
        }
      } 
      // 2. TEXT MESSAGE PROCESSING (WITH GEMINI AI)
      else if (message && message.type === 'text') {
        const userText = message.text.body;
        const lowerText = userText.toLowerCase();
        const from = message.from;
        
        const claimsRef = db.collection('verified_claims');
        const snapshot = await claimsRef.where('keywords', 'array-contains', lowerText).limit(1).get();
        
        let botResponse = "";
        let mediaUrl = null;

        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          
          if (data.category === "price" || data.category === "service") {
            await db.collection("prospects").doc(from).set({
              phone: from, interest: data.category, last_inquiry: userText,
              timestamp: FieldValue.serverTimestamp(), status: "new_lead"
            }, { merge: true });

            const alertText = `🚨 *NEW HIGH-VALUE LEAD* 🚨\n\n*From:* ${from}\n*Interested in:* ${data.category}\n*Message:* "${userText}"\n\nCheck Firestore now to follow up!`;
            
            try {
              await axios.post(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
                messaging_product: "whatsapp", to: ADMIN_NUMBER, text: { body: alertText }
              }, { headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}` } });
            } catch (err) { 
              console.error("Admin Alert Failed", err); 
            }
          }
          
          if (data.category === "onboarding") {
            botResponse = `🚀 *Welcome to the Smart Marketing Tribe!* 🚀\n\nWe are excited to have you.\n${data.content}\n\nIntroduce yourself once you're in!`;
          } else if (data.category === 'blog') {
            botResponse = `💡 *Insight Snippet:* ${data.snippet}\n\nRead the full article here: ${data.url}`;
          } else if (data.category === 'guide') {
            await sendWhatsAppDoc(from, 'gbp');
            res.status(200).send('EVENT_RECEIVED');
            return;
          } else {
            botResponse = `✅ *Official Info:* ${data.content || data.verified_answer}`;
          }
          mediaUrl = data.media_url;
        } 
        // 3. IF NO EXACT MATCH, ROUTE TO GEMINI AI
        else {
          if (GEMINI_API_KEY) {
            try {
              const sessionRef = db.collection('whatsapp_sessions').doc(from);
              const sessionDoc = await sessionRef.get();
              let history = sessionDoc.exists ? sessionDoc.data()?.history || [] : [];

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

              const aiRes = await callGeminiChat(systemPrompt, formattedHistory, GEMINI_API_KEY);
              if (aiRes.error) throw new Error(aiRes.error.message);

              const replyText = aiRes?.candidates?.[0]?.content?.parts?.[0]?.text;
              botResponse = replyText ? replyText.replace(/\*/g, '').trim() : "I am processing a heavy load right now. Please check happyhunterdigital.com.";

              history.push({ role: 'user', text: userText });
              history.push({ role: 'bot', text: botResponse });
              if (history.length > 10) history = history.slice(history.length - 10);

              await sessionRef.set({ history, lastUpdated: FieldValue.serverTimestamp() });
            } catch (err) {
              console.error("WA LLM Error:", err);
              botResponse = "The neural core is recalibrating. Please hold.";
            }
          } else {
            botResponse = "Neural link offline. Please visit happyhunterdigital.com.";
          }
        }

        // 4. TRANSMIT FINAL PAYLOAD
        if (mediaUrl) {
          try {
            await axios.post(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
              messaging_product: "whatsapp", to: from, type: "image",
              image: { link: mediaUrl, caption: botResponse }
            }, { headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}` } });
            res.status(200).send('EVENT_RECEIVED');
            return;
          } catch (mediaError) { 
            console.error("Media Send Error:", mediaError); 
          }
        }

        try {
          await axios.post(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
            messaging_product: "whatsapp", to: from, text: { body: botResponse }
          }, { headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}` } });
        } catch (error: any) {
          console.error("WhatsApp API Transmission Error:", error.response?.data || error.message);
        }
      }
    }
    res.status(200).send('EVENT_RECEIVED');
    return;
  }
  
  res.status(404).send();
});
