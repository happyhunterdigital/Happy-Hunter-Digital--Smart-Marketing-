import { onRequest } from "firebase-functions/v2/https";
import axios from "axios";
import { META_VERIFY_TOKEN, META_PAGE_ACCESS_TOKEN, AI_MODEL } from "../config";
import { callGeminiChat } from "./chatService";

// 1. UNIFIED PROCESS AND REPLY LOGIC (AI INTEGRATION)
const processAndReply = async (commentId: string, userMessage: string, platform: "facebook" | "instagram") => {
  if (!META_PAGE_ACCESS_TOKEN) {
    console.error(`[${platform}] META_PAGE_ACCESS_TOKEN is missing. Handshake aborted.`);
    return;
  }

  const G_KEY = process.env.GEMINI_API_KEY;
  if (!G_KEY) {
    console.error(`[${platform}] GEMINI_API_KEY is missing. Cannot generate AI response.`);
    return;
  }

  try {
    // 1. Process the comment through your existing AI Chat Service
    const systemPrompt = `You are Smart Marketing Chat for Happy Hunter Digital using
${AI_MODEL}. Use plain text, NO Markdown asterisks, NO HTML tags. Founder: Thabo Motsumi. Mission:
Stop SA SMEs from being Ghosts to AI. Primary Tool: happyhunterdigital.com/audit. Contact:
WhatsApp +27(0) 60 101 6673.
You are replying directly to a user's comment on a ${platform} post via a private DM. Keep it very short, friendly, and helpful.`;

    const history = [
      { role: 'user', parts: [{ text: `User commented on ${platform}: ${userMessage}` }] }
    ];

    const aiRes = await callGeminiChat(systemPrompt, history, G_KEY);
    if (aiRes.error) throw new Error(aiRes.error.message);

    const replyText = aiRes?.candidates?.[0]?.content?.parts?.[0]?.text;
    const finalMessage = replyText ? replyText.trim() : "Thanks for connecting! How can we help you dominate AI search today?";

    // 2. Dispatch the dynamic AI response via Meta Graph API
    const url = `https://graph.facebook.com/v19.0/me/messages`;
    const payload = {
      recipient: { comment_id: commentId },
      message: { text: finalMessage }
    };

    await axios.post(url, payload, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${META_PAGE_ACCESS_TOKEN}` 
      }
    });
    
    console.log(`[${platform}] Private Agentic Reply sent successfully to comment node: ${commentId}`);
  } catch (error: any) {
    console.error(`[${platform}] Error in AI processing or Meta API call:`, error.response?.data || error.message);
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
              const userMessage = change.value.message; // Extract FB comment text
              
              await processAndReply(commentId, userMessage, "facebook");
            }
          }
        }
        
        // --- INSTAGRAM COMMENTS ---
        if (body.object === 'instagram') {
          for (const change of changes) {
            if (change.field === 'comments' && change.value?.id) {
              const commentId = change.value.id; 
              const userMessage = change.value.text; // Extract IG comment text
              
              await processAndReply(commentId, userMessage, "instagram");
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
