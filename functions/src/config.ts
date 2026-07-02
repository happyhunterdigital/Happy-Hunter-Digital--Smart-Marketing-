export const AI_MODEL = "deepseek-chat";
export const EMBEDDING_MODEL = "text-embedding-004";

// All secrets are injected via Cloud Secret Manager + functions.config
export const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
export const PLACES_API_KEY = process.env.PLACES_API_KEY || "";
export const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || process.env.META_SYSTEM_TOKEN || "";
export const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || "";

// SECURITY: No hardcoded fallback values. These tokens verify webhook authenticity.
// If unset, verification fails closed.
export const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "";
export const META_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "";

export const META_PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN || "";
export const ADMIN_NUMBER = "27601016673";
export const BASE_URL = "https://happyhunterdigital.com";

// Fail loudly at cold start if critical webhook secrets are missing
if (!VERIFY_TOKEN) {
  console.error("CRITICAL: VERIFY_TOKEN env var is not set. WhatsApp webhook verification will fail closed.");
}
if (!META_VERIFY_TOKEN) {
  console.error("CRITICAL: META_VERIFY_TOKEN env var is not set. Meta webhook verification will fail closed.");
}

export const SAFETY_SETTINGS = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
];
