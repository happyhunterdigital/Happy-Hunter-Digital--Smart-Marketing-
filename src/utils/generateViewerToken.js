// src/utils/generateViewerToken.js
// ══════════════════════════════════════════════════════════════════
// SECURE VIEWER TOKEN GENERATOR
// Used by your WhatsApp bot / Firebase Cloud Function to create
// the ?id= token appended to the CTA button URL.
//
// USAGE IN YOUR WHATSAPP BOT:
//   import { generateViewerToken, buildViewerUrl, buildWhatsAppPayload } from "./generateViewerToken";
//   const token = generateViewerToken();
//   const url   = buildViewerUrl(token);
//   const msg   = buildWhatsAppPayload(recipientNumber, url);
//   // POST msg to https://graph.facebook.com/v19.0/YOUR_PHONE_NUMBER_ID/messages
// ══════════════════════════════════════════════════════════════════

// ─── CONFIGURATION ─────────────────────────────────────────────────────────────
const BASE_URL     = "https://happyhunterdigital.com";
const VIEWER_PATH  = "/view/guide";
const TOKEN_PREFIX = "hhd_secure_";

// Token TTL in milliseconds — 24 hours.
// After this, the ViewGuide component should reject the token.
// Implement server-side TTL validation in a Firebase Cloud Function
// for full security (client-side validation is a UI deterrent only).
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

// ─── TOKEN GENERATION ──────────────────────────────────────────────────────────
/**
 * Generates a cryptographically random viewer token.
 * Format: hhd_secure_TIMESTAMP_RANDOMHEX
 * 
 * @returns {string} A unique, time-bound session token.
 */
export function generateViewerToken() {
  const timestamp = Date.now().toString(36); // base36 timestamp — compact

  // Generate 16 random bytes → 32 hex chars
  const randomPart = Array.from(
    crypto.getRandomValues(new Uint8Array(16)),
    (byte) => byte.toString(16).padStart(2, "0")
  ).join("");

  return `${TOKEN_PREFIX}${timestamp}_${randomPart}`;
}

/**
 * Extracts the creation timestamp from a token.
 * Returns null if the token format is unrecognised.
 * 
 * @param {string} token
 * @returns {number|null} Unix timestamp in ms, or null.
 */
export function extractTokenTimestamp(token) {
  if (!token || !token.startsWith(TOKEN_PREFIX)) return null;
  const body = token.replace(TOKEN_PREFIX, "");
  const parts = body.split("_");
  if (parts.length < 2) return null;
  return parseInt(parts[0], 36);
}

/**
 * Checks whether a token is still within its TTL window.
 * 
 * @param {string} token
 * @returns {boolean}
 */
export function isTokenExpired(token) {
  const ts = extractTokenTimestamp(token);
  if (!ts) return true;
  return Date.now() - ts > TOKEN_TTL_MS;
}

/**
 * Builds the full viewer URL with the token as the ?id= param.
 * 
 * @param {string} token
 * @returns {string} Full URL e.g. https://happyhunterdigital.com/view/guide?id=hhd_secure_...
 */
export function buildViewerUrl(token) {
  return `${BASE_URL}${VIEWER_PATH}?id=${encodeURIComponent(token)}`;
}

// ─── WHATSAPP META API PAYLOAD BUILDER ─────────────────────────────────────────
/**
 * Builds the complete Meta API payload for the Interactive CTA button message.
 * POST this to: https://graph.facebook.com/v19.0/{PHONE_NUMBER_ID}/messages
 * Headers: { Authorization: "Bearer YOUR_META_ACCESS_TOKEN", Content-Type: "application/json" }
 * 
 * @param {string} recipientNumber - E.164 format e.g. "27821234567" (no + prefix for Meta API)
 * @param {string} viewerUrl       - The full URL from buildViewerUrl()
 * @returns {object} Ready-to-POST JSON payload
 */
export function buildWhatsAppPayload(recipientNumber, viewerUrl) {
  return {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: recipientNumber,
    type: "interactive",
    interactive: {
      type: "cta_url",
      header: {
        type: "text",
        text: "HHD Smart Marketing Guide"
      },
      body: {
        text: "Your personalised copy of our Smart Marketing Service Guide is ready to view. Tap the button below — no download required. This link expires in 24 hours."
      },
      footer: {
        text: "happyhunterdigital.com — Secure View"
      },
      action: {
        name: "cta_url",
        parameters: {
          display_text: "View My Guide Now",
          url: viewerUrl
        }
      }
    }
  };
}

// ─── FIREBASE CLOUD FUNCTION EXAMPLE ───────────────────────────────────────────
// Deploy this as a Firebase HTTPS callable function to validate tokens
// server-side before serving the PDF. This is the production-grade approach.
//
// In functions/index.js:
//
// const { onCall } = require("firebase-functions/v2/https");
// const { isTokenExpired } = require("./utils/generateViewerToken");
//
// exports.validateViewerToken = onCall({ cors: true }, async (request) => {
//   const { token } = request.data;
//
//   if (!token || isTokenExpired(token)) {
//     throw new HttpsError("permission-denied", "Invalid or expired viewer token.");
//   }
//
//   // Optionally: look up the token in Firestore to ensure single-use
//   // await admin.firestore().collection("viewer_tokens").doc(token).get()
//
//   return { valid: true };
// });
//
// Then in ViewGuide.jsx, call this function before loading the PDF:
// const { data } = await httpsCallable(functions, "validateViewerToken")({ token });
// ──────────────────────────────────────────────────────────────────────────────
