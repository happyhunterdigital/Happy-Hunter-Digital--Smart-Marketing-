import { GoogleGenerativeAI } from "@google/generative-ai";
import { AuditResult } from "../types";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

export const performAudit = async (businessName: string, location: string): Promise<AuditResult> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `Perform a digital audit for "${businessName}" in "${location}". 
  Return STRICT JSON: {"score": number, "summary": "string", "problems": [{"title": "string", "desc": "string", "severity": "high"}], "solutions": [{"title": "string", "desc": "string"}]}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error(error);
    return { score: 0, summary: "Audit Failed", problems: [], solutions: [] };
  }
};

export const getChatSession = () => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  return model.startChat({ history: [] });
};
