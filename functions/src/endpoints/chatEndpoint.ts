// functions/src/endpoints/chatEndpoint.ts
import { onCall } from "firebase-functions/v2/https";

export const hunterChat = onCall({
  region: "us-central1",
  cors: true,
}, async (request) => {
  // Service completely disabled. Returning a static string.
  return { reply: "The Smart Marketing AI is currently offline for security maintenance. Please email motsumitl@happyhunterdigital.com or message +27 (0) 60 101 6673 directly." };
});
