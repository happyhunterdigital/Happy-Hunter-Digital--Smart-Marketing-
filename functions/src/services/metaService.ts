import { onRequest } from "firebase-functions/v2/https";
import axios from "axios";
import { META_VERIFY_TOKEN, META_PAGE_ACCESS_TOKEN, AI_MODEL } from "../config";
import { callGeminiChat } from "./chatService";

export const sendPrivateReply = async (commentId: string, replyText: string, platform: "facebook" | "instagram") => {
  if (!META_PAGE_ACCESS_TOKEN) {
    console.error(`[${platform}] META_PAGE_ACCESS_TOKEN is missing. Handshake aborted.`);
    return;
  }
  try {
    const url = `https://graph.facebook.com/v19.0/me/messages`;
    const payload = {
      recipient: { comment_id: commentId },
      message: { text: replyText.replace(/\*/g, '') } // STRICT MARKDOWN REMOVAL FOR META API
    };
    await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${META_PAGE_ACCESS_TOKEN}`
      }
    });
    console.log(`[${platform}] Private Agentic Reply sent successfully to comment: ${commentId}`);
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
  } catch (error: any) {
    console.error("Error posting public reply:", error.response?.data || error.message);
  }
};

const processAndReply = async (commentId: string, userMessage: string, platform: "facebook" | "instagram") => {
  const G_KEY = process.env.GEMINI_API_KEY;
  if (!G_KEY) return;

  try {
    const systemPrompt = `You are Smart Marketing Chat for Happy Hunter Digital using ${AI_MODEL}. 
    Use plain text. NEVER USE ASTERISKS OR BOLDING. Keep it to 2 sentences max.
    Mission: Stop SA SMEs from being Ghosts to AI. Tool: happyhunterdigital.com/audit. Contact: +27(0) 60 101 6673.
    You are replying directly to a user's comment via a private DM. Be highly conversational.`;

    const history = [{ role: 'user', parts: [{ text: `User commented on ${platform}: ${userMessage}` }] }];
    
    const aiRes = await callGeminiChat(systemPrompt, history, G_KEY);
    if (aiRes.error) throw new Error(aiRes.error.message);
    
    let replyText = aiRes?.candidates?.[0]?.content?.parts?.[0]?.text;
    const finalMessage = replyText ? replyText.replace(/\*/g, '').trim() : "Thanks for connecting! Run your free AI Audit at happyhunterdigital.com/audit.";
    
    await sendPrivateReply(commentId, finalMessage, platform);
  } catch (error: any) {
    console.error(`[${platform}] Error in AI processing:`, error.message);
  }
};

export const metaWebhook = onRequest(async (req, res) => {
  if (req.method === 'GET') {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === META_VERIFY_TOKEN) {
      res.status(200).send(req.query['hub.challenge']);
    } else {
      res.status(403).send('Verification failed');
    }
    return;
  }

  if (req.method === 'POST') {
    const body = req.body;
    if (body.object === 'page' || body.object === 'instagram') {
      const entries = body.entry || [];
      for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
          // FB Logic
          if (body.object === 'page' && change.field === 'feed' && change.value?.item === 'comment' && change.value?.verb === 'add') {
            if (change.value.from?.id === entry.id) continue;
            await processAndReply(change.value.comment_id, change.value.message, "facebook");
          }
          // IG Logic
          if (body.object === 'instagram' && change.field === 'comments' && change.value?.id) {
            if (change.value.from?.id === entry.id) continue;
            await processAndReply(change.value.id, change.value.text, "instagram");
          }
        }
      }
    }
    res.status(200).send("EVENT_RECEIVED");
  }
});
