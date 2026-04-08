import { onRequest } from "firebase-functions/v2/https";
import axios from "axios";
import { META_VERIFY_TOKEN, META_PAGE_ACCESS_TOKEN } from "../config";

// 1. PRIVATE REPLY LOGIC
export const sendPrivateReply = async (commentId: string, replyText: string, platform: "facebook" | "instagram") => {
  if (!META_PAGE_ACCESS_TOKEN) {
    console.error(`[${platform}] META_PAGE_ACCESS_TOKEN is missing. Handshake aborted.`);
    return;
  }

  try {
    const url = `https://graph.facebook.com/v19.0/me/messages`;
    const payload = {
      recipient: { comment_id: commentId },
      message: { text: replyText }
    };

    await axios.post(url, payload, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${META_PAGE_ACCESS_TOKEN}` 
      }
    });
    
    console.log(`[${platform}] Private Agentic Reply sent successfully to comment node: ${commentId}`);
  } catch (error: any) {
    console.error(`[${platform}] Error sending private reply:`, error.response?.data || error.message);
  }
};

// 2. UNIFIED WEBHOOK CONTROLLER
export const metaWebhook = onRequest(async (req, res) => {
  // Webhook Verification (GET)
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

  // Handle Incoming Comments (POST)
  if (req.method === 'POST') {
    const body = req.body;

    if (body.object === 'page' || body.object === 'instagram') {
      const entries = body.entry || [];
      
      for (const entry of entries) {
        const changes = entry.changes || [];
        
        // --- FACEBOOK COMMENTS ---
        if (body.object === 'page') {
          for (const change of changes) {
            if (change.field === 'feed' && change.value?.item === 'comment' && change.value?.verb === 'add') {
              const commentId = change.value.comment_id;
              await sendPrivateReply(
                commentId, 
                "Thanks for connecting on Facebook! This is an automated DM from Happy Hunter Digital.", 
                "facebook"
              );
            }
          }
        }
        
        // --- INSTAGRAM COMMENTS ---
        if (body.object === 'instagram') {
          for (const change of changes) {
            if (change.field === 'comments' && change.value?.id) {
              const commentId = change.value.id; 
              await sendPrivateReply(
                commentId, 
                "Thanks for connecting on Instagram! This is an automated DM from Happy Hunter Digital.", 
                "instagram"
              );
            }
          }
        }
      }
      res.status(200).send("EVENT_RECEIVED");
    } else {
      res.status(404).send("Not Found");
    }
  }
});
