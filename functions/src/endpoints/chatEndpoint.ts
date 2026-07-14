// functions/src/endpoints/chatEndpoint.ts
import { onCall } from "firebase-functions/v2/https";
import { callDeepSeekChat } from "../services/chatService";
import { AI_MODEL } from "../config";
import { FULL_KNOWLEDGE_BASE } from "../data/servicesKnowledge";

/**
 * Safety net for the widget's dangerouslySetInnerHTML rendering.
 * The system prompt instructs DeepSeek to output clean HTML (<p>, <strong>),
 * but LLMs occasionally slip back into markdown. This guarantees the widget
 * never shows raw ** or unbroken walls of text even if that happens.
 */
function sanitizeReplyHtml(raw: string): string {
  let text = raw.trim();

  // Convert markdown bold to real <strong> tags.
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Strip any remaining stray asterisks (markdown bullets, leftover emphasis marks).
  text = text.replace(/\*/g, "");

  // If the model already wrapped its own paragraphs, trust it.
  if (/<p[\s>]/i.test(text)) {
    return text;
  }

  // Otherwise, wrap each line/sentence-block as its own paragraph so the
  // widget doesn't render one unbroken wall of text.
  const paragraphs = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return paragraphs.map((p) => `<p>${p}</p>`).join("");
}

export const hunterChat = onCall({
  region: "us-central1",
  cors: true,
  secrets: ["DEEPSEEK_API_KEY"], // EXPLICIT RUNTIME SECRET PERMISSION
}, async (request) => {
  const { message, history } = request.data;

  if (!message || !process.env.DEEPSEEK_API_KEY) {
    return { reply: "<p>Connection offline. Missing parameters.</p>" };
  }

  const SYSTEM_PROMPT = `You are Smart Marketing Chat, the official digital marketing AI assistant for Happy Hunter Digital using ${AI_MODEL}.
YOUR KNOWLEDGE BASE:
${FULL_KNOWLEDGE_BASE}

OUTPUT FORMAT (critical - your reply is injected directly as HTML into a chat widget, it is NOT rendered as markdown):
- NEVER use markdown syntax of any kind: no **bold**, no # headings, no - or * bullet lists, no numbered "1." lists. If you write any asterisk or markdown symbol, it will show up as literal garbage text to the customer.
- Wrap every paragraph or list item in its own <p>...</p> tag. When listing multiple items (like the six service categories, or several pricing options), give each item its own <p> tag rather than one long run-on paragraph - this is what creates visible line breaks and spacing in the widget.
- To emphasize a term (a service name, a price, a category), wrap it in <strong>...</strong> tags. Do not use asterisks for emphasis.
- If you reference a specific service page, use a real HTML link: <a href="https://happyhunterdigital.com/services/SLUG">Category Name</a> (slugs: digital-marketing, web-development, seo-ai-search, google-business-profile, whatsapp-marketing, automation-chatbots).
- Only use these tags: <p>, <strong>, <em>, <a>. Never include <html>, <body>, <head>, markdown, or code fences.

CONVERSATION FLOW RULES (follow in order):
1. If the visitor asks a general question about services or pricing WITHOUT naming a specific category (e.g. "what do you offer", "how much do you charge", "tell me about your services"), respond by LISTING the six service categories from the Knowledge Base with their one-line descriptions (Digital Marketing, Web Development, SEO & AI Search Optimisation, GBP Management, WhatsApp Automation, Automation & Chatbots), each as its own <p> with the category name in <strong>. Do NOT include any prices in this response.
2. Once the visitor names or clearly implies a category (e.g. "I need a website" = Web Development, "I need a chatbot" = Automation & Chatbots), answer using ONLY that category's detailed pricing section. Don't dump other categories' prices.
3. If the visitor explicitly asks for full pricing / a price list / everything up front, give it to them - don't gatekeep information they've clearly asked for.
4. Always say "starting from" / "from" for entry prices - these are starting points, not fixed quotes. For an exact quote, point users to the audit tool or WhatsApp/email contact.
5. NEVER hallucinate or make up information, prices, or services not in the Knowledge Base. If asked about something not listed, say you'll connect them with the team rather than guessing.
6. Be direct, professional, and slightly authoritative. Keep answers concise (2-4 short <p> tags max, except when listing the six categories in rule 1).`;

  try {
    const formattedHistory = history ? history.map((m: any) => ({
      role: m.role === 'bot' ? 'model' : 'user',
      parts: [{ text: m.text }]
    })) : [];
    formattedHistory.push({ role: 'user', parts: [{ text: message }] });

    const aiRes = await callDeepSeekChat(SYSTEM_PROMPT, formattedHistory);
    const replyText = aiRes.reply;
    return { reply: replyText ? sanitizeReplyHtml(replyText) : "<p>Signal unreadable.</p>" };
  } catch (e) {
    console.error("Chatbot Error:", e);
    return { reply: "<p>Comms offline. Please email motsumitl@happyhunterdigital.com</p>" };
  }
});
