import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Official SDK safely
let genAI: GoogleGenerativeAI | null = null;

const getGenAI = () => {
  if (!genAI) {
    const API_KEY = import.meta.env.VITE_API_KEY;
    if (!API_KEY) {
      console.warn("CRITICAL: API Key missing.");
      return null;
    }
    genAI = new GoogleGenerativeAI(API_KEY);
  }
  return genAI;
};

// 1. Audit Logic (The Lead Magnet)
export const performAudit = async (businessName: string, location: string) => {
  const ai = getGenAI();
  if (!ai) throw new Error("AI Service Unavailable");

  // Use Flash model for speed/stability
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `
    Audit Target: "${businessName}" in "${location}".
    You are an expert Digital Marketing Auditor.
    Output strict JSON only. No markdown formatting.
    Structure: {
      "overallScore": number (0-100),
      "summary": "string",
      "gaps": ["string"],
      "winStrategy": "string"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    // Clean the output to ensure valid JSON
    const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Audit Protocol Failed:", error);
    // Return fallback data so app doesn't crash
    return {
      overallScore: 0,
      summary: "System offline. Manual audit required.",
      gaps: ["Connection interrupted"],
      winStrategy: "Please contact support."
    };
  }
};

// 2. Chat Logic (The Bot)
export const getChatSession = () => {
  const ai = getGenAI();
  if (!ai) return null;
  
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
  return model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "You are Hunter AI, a digital marketing expert. Be professional." }],
      },
      {
        role: "model",
        parts: [{ text: "Understood. I am ready to assist with Digital Entity Management." }],
      },
    ],
  });
};
