import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");

// This is the "hunterAI" object the compiler is looking for
export const hunterAI = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `You are Hunter AI for Happy Hunter Digital. Identity: Professional, expert in Digital Entity Management. Goal: Direct users to book at https://calendly.com/motsumitl/30min.`,
});

// This is the "Daisy Chain" fallback function for high-reliability
export const getAiResponse = async (userPrompt: string) => {
  const MODELS = [
    { name: "gemini-1.5-flash", version: "v1beta" },
    { name: "gemini-1.5-pro", version: "v1beta" },
    { name: "gemini-pro", version: "v1" }
  ];

  for (const model of MODELS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/${model.version}/models/${model.name}:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `System: You are Hunter AI. Context: SA Marketing. Query: ${userPrompt}` }] }]
          })
        }
      );
      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
    } catch (e) {
      console.warn(`Model ${model.name} failed, trying next...`);
    }
  }
  return "I'm experiencing a high-load signal. Tap the WhatsApp icon for immediate human support.";
};
