// functions/src/endpoints/chatEndpoint.ts
import { onCall } from "firebase-functions/v2/https";
import { callDeepSeekChat } from "../services/chatService";
import { AI_MODEL, DEEPSEEK_API_KEY } from "../config";

export const hunterChat = onCall({
  region: "us-central1",
  cors: true,
}, async (request) => {
  const { message, history } = request.data;

  if (!message || !DEEPSEEK_API_KEY) {
    return { reply: "Connection offline. Missing parameters." };
  }

  const SYSTEM_PROMPT = `You are Smart Marketing Chat, the official digital marketing AI assistant for Happy Hunter Digital using ${AI_MODEL}.
  YOUR KNOWLEDGE BASE:
  - Founder & Head Strategist: Thabo Motsumi.
  - Our Mission: We stop South African SMEs from being "Ghosts" to AI algorithms. We turn physical businesses into digital powerhouses via Generative Engine Optimization (GEO).
  - Primary Tool: The "Smart Marketing Scan" (provides a Digital Survival Score). Tell users to go to happyhunterdigital.com/audit.
  - Contact: WhatsApp +27 (0) 60 101 6673 or email motsumitl@happyhunterdigital.com.
  OUR SERVICES & PRICING:
  - Phase 1 (Entity Architecture): Foundation setups starting at R9,950.
  - Phase 2 (AEO Retainers): Growth setups starting at R19,950/mo.
  - Phase 3 (Enterprise): Advanced Automation starting at R39,950/mo.
  RULES:
  1. NEVER hallucinate or make up information. Use ONLY the Knowledge Base.
  2. Be direct, professional, and slightly authoritative. Keep answers concise (2-4 sentences max).`;

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
