import { GoogleGenAI, Tool } from "@google/genai";
import { AuditResult, GroundingSource } from "../types";

const parseGeminiResponse = (text: string): any => {
  try {
    // Attempt to extract JSON if it's wrapped in code blocks
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }
    // Fallback: try parsing the whole text as JSON
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse Gemini response:", e);
    throw new Error("The AI analysis could not be processed. Please try again.");
  }
};

export const performAudit = async (businessName: string, location: string): Promise<AuditResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please configure process.env.API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are an expert Digital Marketing Auditor for Happy Hunter Agencies.
    Perform a rigorous audit for the business "${businessName}" located in "${location}".
    
    Use Google Search to find their Google Business Profile, Website, Social Media, and Reviews.
    
    Analyze based on these 5 pillars:
    1. Visibility (Category accuracy, keyword health, local ranking).
    2. Trust (Review count, rating, recency, photo recency).
    3. Conversion (Booking options, completed profile, website UX).
    4. Activity (Posting frequency, engagement).
    5. Competitor Gap (How they compare to top local rivals).

    Output a STRICT JSON object wrapped in \`\`\`json code blocks.
    The JSON must have this structure:
    {
      "businessName": "${businessName}",
      "location": "${location}",
      "overallScore": number (0-100),
      "pillars": [
        { "name": "Visibility", "score": number (0-100), "status": "Critical" | "Warning" | "Good" | "Excellent", "observation": "Short specific finding" },
        ... (repeat for Trust, Conversion, Activity, Competitor Gap)
      ],
      "competitorGap": "A short sentence comparing them to local rivals.",
      "winStrategy": "One specific, high-impact action they should take immediately to improve."
    }
    
    Be honest and critical. If data is missing (e.g. no GMB found), give a low score for Visibility and mention it in the observation.
  `;

  const tools: Tool[] = [{ googleSearch: {} }];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: tools,
        temperature: 0.4, // Lower temperature for more analytical output
      }
    });

    const text = response.text || "";
    const data = parseGeminiResponse(text);

    // Extract grounding sources
    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri
          });
        }
      });
    }

    return {
      ...data,
      sources
    };

  } catch (error) {
    console.error("Audit Error:", error);
    throw error;
  }
};