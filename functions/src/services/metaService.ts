// functions/src/services/metaService.ts
import { onRequest } from "firebase-functions/v2/https";
import axios from "axios";
import { META_VERIFY_TOKEN, META_PAGE_ACCESS_TOKEN, DEEPSEEK_API_KEY } from "../config";
import { callDeepSeek } from "./deepseekService";

export const sendPrivateReply = async (commentId: string, replyText: string, platform: "facebook" | "instagram") => {
  if (!META_PAGE_ACCESS_TOKEN) {
    console.error(`[${platform}] META_PAGE_ACCESS_TOKEN is missing. Handshake aborted.`);
    return;
  }
  try {
    const url = `https://graph.facebook.com/v19.0/me/messages`;
    const payload = {
      recipient: { comment_id: commentId },
      message: { text: replyText.replace(/\*/g, '') } 
    };
    await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${META_PAGE_ACCESS_TOKEN}`
      }
    });
    console.log(`[${platform}] Private Agentic Reply sent successfully to node: ${commentId}`);
  } catch (error: any) {
    console.error(`[${platform}] Error sending private reply:`, error.response?.data || error.message);
  }
};

export const sendPublicReply = async (commentId: string, messageText: string) => {
  if (!META_PAGE_ACCESS_TOKEN) return;
  try {
    const url = `https://graph.facebook.com/v19.0/${commentId}/comments`;
    await axios.post(url, { message: messageText.replace(/\*/g, '') }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${META_PAGE_ACCESS_TOKEN}`
      }
    });
    console.log(`Public confirmation dispatched to comment node: ${commentId}`);
  } catch (error: any) {
    console.error("Error posting public reply:", error.response?.data || error.message);
  }
};

const processAndReply = async (commentId: string, userMessage: string, platform: "facebook" | "instagram") => {
  if (!DEEPSEEK_API_KEY) {
    console.error(`[${platform}] DEEPSEEK_API_KEY is missing. Cannot generate AI response.`);
    return;
  }
  try {
    console.log(`[${platform}] Processing comment ID: ${commentId}. User said: "${userMessage}"`);
    const systemPrompt = `You are the social media assistant for Happy Hunter Digital. Keep the reply incredibly short, polite, helpful, and natural. No asterisks.`;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: `User commented on ${platform}: ${userMessage}` }
    ];
    
    const replyText = await callDeepSeek(messages, { temperature: 0.5 });
    const finalMessage = replyText ? replyText.replace(/\*/g, '').trim() : "Thanks for connecting! Run your free AI visibility audit at happyhunterdigital.com/audit.";
    
    await sendPrivateReply(commentId, finalMessage, platform);
  } catch (error: any) {
    console.error(`[${platform}] Error in AI processing:`, error.message);
  }
};

export const metaWebhook = onRequest({
  secrets: ["DEEPSEEK_API_KEY"] // EXPLICIT RUNTIME SECRET PERMISSION FOR DEEPSEEK
}, async (req, res) => {
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === META_VERIFY_TOKEN) {
      console.log("Webhook verified successfully by Meta.");
      res.status(200).send(challenge);
    } else {
      console.error("Webhook verification failed. Token mismatch.");
      res.status(403).send('Verification failed');
    }
    return;
  }

  if (req.method === 'POST') {
    const body = req.body;
    console.log("INCOMING META WEBHOOK PAYLOAD:", JSON.stringify(body, null, 2));

    if (body.object === 'page' || body.object === 'instagram') {
      const entries = body.entry || [];
      for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
          
          if (body.object === 'page' && change.field === 'feed' && change.value?.item === 'comment' && change.value?.verb === 'add') {
            if (change.value.from?.id === entry.id) continue;
            await processAndReply(change.value.comment_id, change.value.message, "facebook");
          }

          if (body.object === 'page' && change.field === 'feed' && change.value?.item === 'reaction' && change.value?.verb === 'add') {
            if (change.value.from?.id === entry.id) continue;
            const targetId = change.value.comment_id || change.value.post_id;
            if (targetId) {
              await sendPrivateReply(targetId, "Thanks for the reaction! Run your free AI visibility audit at happyhunterdigital.com/audit.", "facebook");
            }
          }

          if (body.object === 'instagram' && change.field === 'comments' && change.value?.id) {
            if (change.value.from?.id === entry.id) continue;
            await processAndReply(change.value.id, change.value.text, "instagram");
          }
        }
      }
    }
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.status(404).send("Not Found");
  }
});
