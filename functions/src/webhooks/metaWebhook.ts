import { onRequest } from "firebase-functions/v2/https";
import { META_VERIFY_TOKEN } from "../config";
import { sendPrivateReply } from "../services/metaService";

export const metaWebhook = onRequest(async (req, res) => {
  // 1. Webhook Verification (GET)
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

  // 2. Handle Incoming Comments (POST)
  if (req.method === 'POST') {
    const body = req.body;

    if (body.object === 'page' || body.object === 'instagram') {
      for (const entry of body.entry || []) {
        
        // --- FACEBOOK COMMENTS ---
        if (body.object === 'page' && entry.changes) {
          for (const change of entry.changes) {
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
        if (body.object === 'instagram' && entry.changes) {
          for (const change of entry.changes) {
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
