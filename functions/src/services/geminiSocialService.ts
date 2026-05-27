// functions/src/services/geminiSocialService.ts
import { AI_MODEL, SAFETY_SETTINGS, GEMINI_API_KEY } from "../config";

export const callGeminiForSocial = async (prompt: string, history: any[], gKey: string) => {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent?key=${gKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: prompt }] },
      contents: history,
      safetySettings: SAFETY_SETTINGS,
      generationConfig: { temperature: 0.1, maxOutputTokens: 500 }
    })
  });

  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  return res.json() as any;
};
