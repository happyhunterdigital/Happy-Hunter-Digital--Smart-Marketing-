import { onCall } from "firebase-functions/v2/https";
import { callGeminiChat } from "../services/chatService";
import { AI_MODEL } from "../config";

export const hunterChat = onCall({
  region: "us-central1",
  cors: true,
}, async (request) => {
  const { message, history } = request.data;
  const G_KEY = process.env.GEMINI_API_KEY;

  if (!message || !G_KEY) {
    return { reply: "Connection offline. Missing parameters." };
  }

  // FIX: Utilizing the imported AI_MODEL variable
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

    const aiRes = await callGeminiChat(SYSTEM_PROMPT, formattedHistory, G_KEY);
    if (aiRes.error) throw new Error(aiRes.error.message);
    
    const replyText = aiRes?.candidates?.[0]?.content?.parts?.[0]?.text;
    return { reply: replyText ? replyText.trim() : "Signal unreadable." };
  } catch (e) {
    console.error("Chatbot Error:", e);
    return { reply: "Comms offline. Please email motsumitl@happyhunterdigital.com" };
  }
});
