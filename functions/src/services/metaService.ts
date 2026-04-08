import axios from "axios";
import { META_PAGE_ACCESS_TOKEN } from "../config";

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

export const sendPublicReply = async (commentId: string, messageText: string) => {
  if (!META_PAGE_ACCESS_TOKEN) return;

  try {
    const url = `https://graph.facebook.com/v19.0/${commentId}/comments`;
    await axios.post(url, { message: messageText }, {
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
