// functions/src/services/metaService.ts
import { onRequest } from "firebase-functions/v2/https";
import axios from "axios";
import { META_VERIFY_TOKEN, META_PAGE_ACCESS_TOKEN } from "../config";

export const sendPrivateReply = async (commentId: string, replyText: string, platform: "facebook" | "instagram") => {
  if (!META_PAGE_ACCESS_TOKEN) return;
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
  } catch (error: any) {
    console.error(`[${platform}] Error sending private reply:`, error.response?.data || error.message);
  }
};

const processAndReply = async (commentId: string, userMessage: string, platform: "facebook" | "instagram") => {
  try {
    const finalMessage = "Thanks for connecting! Run your free visibility audit at happyhunterdigital.com/audit to see if your business is AI-ready.";
    await sendPrivateReply(commentId, finalMessage, platform);
  } catch (error: any) {
    console.error(`[${platform}] Error processing:`, error.message);
  }
};

export const metaWebhook = onRequest(async (req, res) => {
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === META_VERIFY_TOKEN) {
      res.status(200).send(challenge);
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
