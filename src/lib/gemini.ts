import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");

export const hunterAI = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `You are Hunter AI for Happy Hunter Digital. Identity: Professional, expert in Digital Entity Management. Mission: Help SA businesses stop being invisible. Call to Action: Book at https://calendly.com/motsumitl/30min.`,
});
