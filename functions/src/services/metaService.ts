// functions/src/services/metaService.ts
import { onRequest } from "firebase-functions/v2/https";
import axios from "axios";
import { META_VERIFY_TOKEN, META_PAGE_ACCESS_TOKEN } from "../config";

const processAndReply = async (commentId: string, platform: "facebook" | "instagram") => {
  const replyText = `Thanks for connecting on ${platform}! This is an automated DM from Happy Hunter Digital.`;
  const url = `https://graph.facebook.com/v19.0/me/messages`;
  
  const payload = {
    recipient: { comment_id: commentId },
    message: { text: replyText }
  };

  try {
    await axios.post(url, payload, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${META_PAGE_ACCESS_TOKEN}`
      }
    });
    console.log(`[${platform}] Private reply sent successfully to ${commentId}`);
  } catch (error: any) {
    console.error(`[${platform}] Error sending private reply:`, error.response?.data || error.message);
  }
};

export const metaWebhook = onRequest(async (req, res) => {
  // 1. Webhook Verification
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    if (mode === "subscribe" && token === META_VERIFY_TOKEN) {
      res.status(200).send(req.query["hub.challenge"]);
    } else {
      res.status(403).send("Forbidden");
    }
    return;
  }

  // 2. Incoming Event Processing
  if (req.method === "POST") {
    const body = req.body;

    if (body.object === "page" || body.object === "instagram") {
      for (const entry of body.entry || []) {
        
        // --- FACEBOOK COMMENTS ---
        if (body.object === "page" && entry.changes) {
          for (const change of entry.changes) {
            if (change.field === "feed" && change.value?.item === "comment" && change.value?.verb === "add") {
              await processAndReply(change.value.comment_id, "facebook");
            }
          }
        }
        
        // --- INSTAGRAM COMMENTS ---
        if (body.object === "instagram" && entry.changes) {
          for (const change of entry.changes) {
            if (change.field === "comments" && change.value?.id) {
              await processAndReply(change.value.id, "instagram");
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
