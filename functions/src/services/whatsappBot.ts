// functions/src/services/whatsappBot.ts
import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import axios from "axios";
import { VERIFY_TOKEN, ADMIN_NUMBER, PHONE_NUMBER_ID, WHATSAPP_TOKEN } from "../config";
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
        else {
          // GEMINI COMPLETELY REMOVED. Static fallback applied.
          botResponse = "Thanks for your message! Our AI is currently offline for security upgrades. Please visit https://happyhunterdigital.com or hold for a human agent.";
        }

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
