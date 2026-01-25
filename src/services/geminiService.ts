import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const performAudit = async (businessName: string, location: string) => {
  if (!genAI) throw new Error("API Key Missing");
  
  // War Room: Use 'gemini-1.5-flash' for stability
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // PDF LOGIC PRESERVED: The specific 5 Pillars Prompt
  const prompt = `
    You are an expert Digital Marketing Auditor for Happy Hunter Agencies.
    Perform a rigorous audit for the business "${businessName}" located in "${location}".
    
    Analyze based on these 5 pillars:
    1. Visibility (Category accuracy, keyword health, local ranking).
    2. Trust (Review count, rating, recency, photo recency).
    3. Conversion (Booking options, completed profile, website UX).
    4. Activity (Posting frequency, engagement).
    5. Competitor Gap (How they compare to top local rivals).

    Output a STRICT JSON object.
    Structure:
    {
      "businessName": "${businessName}",
      "location": "${location}",
      "overallScore": number (0-100),
      "pillars": [
        { "name": "string", "score": number, "status": "Critical"|"Good", "observation": "string" }
      ],
      "winStrategy": "string"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Audit Error:", error);
    // Fallback to prevent crash
    return { overallScore: 0, pillars: [], winStrategy: "Audit failed. Please retry." };
  }
};

export const getChatSession = () => {
  if (!genAI) return null;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  return model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "You are 'Hunter AI', the intelligent digital assistant for Happy Hunter Digital. Be professional, confident, and strategic." }],
      },
      {
        role: "model",
        parts: [{ text: "Understood. I am ready to assist with Digital Entity Management." }],
      },
    ],
  });
};
