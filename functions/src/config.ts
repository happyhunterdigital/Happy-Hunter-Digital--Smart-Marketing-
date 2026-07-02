// functions/src/config.ts
export const AI_MODEL = "deepseek-chat";
export const EMBEDDING_MODEL = "text-embedding-004";

// All secrets are injected via Cloud Secret Manager + functions.config
export const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
export const PLACES_API_KEY = process.env.PLACES_API_KEY || "";

export const ADMIN_NUMBER = "27601016673";
export const BASE_URL = "https://happyhunterdigital.com";

// Safety settings for any Gemini fallback (kept for compatibility)
export const SAFETY_SETTINGS = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
];
