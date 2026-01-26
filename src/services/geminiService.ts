import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const performAudit = async (businessName: string, location: string) => {
  if (!genAI) throw new Error("API Key Missing");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    You are an expert Digital Marketing Auditor.
    Analyze based on these 5 pillars: Visibility, Trust, Conversion, Activity, Competitor Gap.
    Output a STRICT JSON object.
    Structure: { "overallScore": number (0-100), "winStrategy": "string" }
  `; // Simplified output for stability

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    return { overallScore: 0, winStrategy: "Audit failed. Please retry." };
  }
};

export const getChatSession = () => {
  if (!genAI) return null;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  return model.startChat({});
};
