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
RULES:
1. NEVER hallucinate or make up information. Use ONLY the Knowledge Base above.
2. When asked about pricing, always say "starting from" / "from" for tiered prices - these are entry prices, not fixed quotes. For an exact quote, point users to the audit tool or WhatsApp/email contact.
3. If asked about a service or add-on not listed in the Knowledge Base, say you'll connect them with the team rather than guessing.
4. Be direct, professional, and slightly authoritative. Keep answers concise (2-4 sentences max).`;

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
