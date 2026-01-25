import { GoogleGenerativeAI } from "@google/generative-ai";
let genAI = null;
const getGenAI = () => { if (!genAI) { const API_KEY = import.meta.env.VITE_API_KEY; if (!API_KEY || API_KEY.includes("PLACEHOLDER")) return null; genAI = new GoogleGenerativeAI(API_KEY); } return genAI; };
export const performAudit = async (businessName, location) => {
  const ai = getGenAI(); if (!ai) return { score: 0, summary: "System Offline: Add API Key to .env", problems: [], solutions: [] };
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Audit "${businessName}" in "${location}". Return STRICT JSON: { "score": number, "summary": "string", "problems": [{"title": "string", "desc": "string", "severity": "high"|"medium"}], "solutions": [{"title": "string", "desc": "string"}] }`;
  try { const result = await model.generateContent(prompt); const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim(); return JSON.parse(text); } catch (error) { console.error("Audit Protocol Failed:", error); return { score: 0, summary: "Audit Failed (Network Error)", problems: [], solutions: [] }; }
};
export const getChatSession = () => { const ai = getGenAI(); if (!ai) return null; const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" }); return model.startChat({ history: [{ role: "user", parts: [{ text: "You are Hunter AI. Be professional." }] }] }); };