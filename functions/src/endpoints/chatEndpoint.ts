// functions/src/endpoints/chatEndpoint.ts
import { onCall } from "firebase-functions/v2/https";
import { callDeepSeekChat } from "../services/chatService";
import { AI_MODEL } from "../config";
import { FULL_KNOWLEDGE_BASE } from "../data/servicesKnowledge";

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

CONVERSATION FLOW RULES (follow in order):
1. If the visitor asks a general question about services or pricing WITHOUT naming a specific category (e.g. "what do you offer", "how much do you charge", "tell me about your services"), respond by LISTING the six service categories from the Knowledge Base with their one-line descriptions (Digital Marketing, Web Development, SEO & AI Search Optimisation, GBP Management, WhatsApp Automation, Automation & Chatbots). Do NOT include any prices in this response.
2. Once the visitor names or clearly implies a category (e.g. "I need a website" = Web Development, "I need a chatbot" = Automation & Chatbots), answer using ONLY that category's detailed pricing section. Don't dump other categories' prices.
3. If the visitor explicitly asks for full pricing / a price list / everything up front, give it to them - don't gatekeep information they've clearly asked for.
4. Always say "starting from" / "from" for entry prices - these are starting points, not fixed quotes. For an exact quote, point users to the audit tool or WhatsApp/email contact.
5. NEVER hallucinate or make up information, prices, or services not in the Knowledge Base. If asked about something not listed, say you'll connect them with the team rather than guessing.
6. Be direct, professional, and slightly authoritative. Keep answers concise (2-4 sentences max, except when listing the six categories in rule 1).`;

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
