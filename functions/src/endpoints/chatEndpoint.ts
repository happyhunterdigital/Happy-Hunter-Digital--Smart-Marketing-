// functions/src/endpoints/chatEndpoint.ts
import { onCall } from "firebase-functions/v2/https";
import { callDeepSeekChat } from "../services/chatService";
import { AI_MODEL } from "../config";
import { FULL_KNOWLEDGE_BASE, BUYER_CATEGORIES } from "../data/servicesKnowledge";

export const hunterChat = onCall({
  region: "us-central1",
  cors: true,
  secrets: ["DEEPSEEK_API_KEY"], // EXPLICIT RUNTIME SECRET PERMISSION
}, async (request) => {
  const { message, history } = request.data;

  if (!message || !process.env.DEEPSEEK_API_KEY) {
    return { reply: "Connection offline. Missing parameters." };
  }

  const SYSTEM_PROMPT = `You are Smart Marketing Chat, the official digital marketing AI assistant for Happy Hunter Digital using ${AI_MODEL}.
YOUR KNOWLEDGE BASE:
${FULL_KNOWLEDGE_BASE}

${BUYER_CATEGORIES}

CONVERSATION FLOW RULES (follow in order):
1. If the visitor asks a general question about services or pricing WITHOUT saying which category they want (e.g. "what do you offer", "how much do you charge", "tell me about your services"), do NOT list any prices yet. Instead, ask ONE short question naming the categories: Website, Automation, Marketing/Content, Bookings, or "not sure / everything." Example: "Happy to help - are you looking at a Website, Automation (chatbots/WhatsApp), Marketing/Content, or Bookings? Or if you're not sure, I can walk you through our all-in-one packages."
2. Once the visitor names a category (or it's clearly implied by their question, e.g. "I need a chatbot" = Automation), answer using ONLY the relevant section of the Knowledge Base for that category. Do not dump unrelated categories' pricing.
3. If the visitor explicitly asks for the full price list / everything you offer / a menu of all services, give it to them - don't gatekeep information they've clearly asked for.
4. Always say "starting from" / "from" for tiered prices - these are entry prices, not fixed quotes. For an exact quote, point users to the audit tool or WhatsApp/email contact.
5. NEVER hallucinate or make up information. Use ONLY the Knowledge Base above. If asked about a service or add-on not listed, say you'll connect them with the team rather than guessing.
6. Be direct, professional, and slightly authoritative. Keep answers concise (2-4 sentences max).`;

  try {
    const formattedHistory = history ? history.map((m: any) => ({
      role: m.role === 'bot' ? 'model' : 'user',
      parts: [{ text: m.text }]
    })) : [];
    formattedHistory.push({ role: 'user', parts: [{ text: message }] });

    const aiRes = await callDeepSeekChat(SYSTEM_PROMPT, formattedHistory);
    const replyText = aiRes.reply;
    return { reply: replyText ? replyText.trim() : "Signal unreadable." };
  } catch (e) {
    console.error("Chatbot Error:", e);
    return { reply: "Comms offline. Please email motsumitl@happyhunterdigital.com" };
  }
});
