import { AI_MODEL, SAFETY_SETTINGS } from "../config";

export const callGeminiChat = async (prompt: string, history: any[], gKey: string) => {
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
  if (!res.ok) throw new Error(`Chat API Error: ${res.status}`);
  return res.json() as any;
};
