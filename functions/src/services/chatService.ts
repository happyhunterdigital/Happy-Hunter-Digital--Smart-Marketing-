import { AI_MODEL, SAFETY_SETTINGS } from "../config";

export const callGeminiChat = async (prompt: string, history: any[], gKey: string) => {
  if (!gKey) throw new Error("Gemini API Key missing");

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

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Chat API Error: ${res.status} - ${errorText}`);
  }

  const data = await res.json() as any;
  
  // Defensive check for response structure
  if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error("Invalid response structure from Gemini");
  }

  return data;
};
