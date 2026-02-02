import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Gemini API Key is missing! Check GitHub Secrets.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

export const hunterAI = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `You are Hunter AI, the digital assistant for Happy Hunter Digital.
  YOUR PURPOSE: Help South African SMEs understand why they are invisible to AI search engines.
  CORE CONCEPTS: Digital Entity Management, Mirror Rule, Information Gain.
  CTAs: Direct users to book an audit at https://calendly.com/motsumitl/30min.
  BEHAVIOR: Do not hallucinate. If you don't know a local SA marketing regulation, say so.`,
});
