// functions/src/config.ts
export const AI_MODEL = "gemini-3.1-flash-lite-preview";
export const EMBEDDING_MODEL = "text-embedding-004";
export const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || process.env.META_SYSTEM_TOKEN || "";
export const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || "";
export const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "HAPPY_HUNTER_SECURE_2026";
export const ADMIN_NUMBER = "27601016673";
export const BASE_URL = "https://happyhunterdigital.com";
export const SAFETY_SETTINGS = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
];
