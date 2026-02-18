import * as functions from "firebase-functions/v2";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Force JHB region for speed and POPIA compliance
const REGION = "africa-south1";

// CORS whitelist
const ALLOWED_ORIGINS = [
  "https://happyhunterdigital.com",
  "https://www.happyhunterdigital.com",
  "https://happyhunterdigital.github.io",
  "http://localhost:5173",
  "http://localhost:3000"
];

// Secure Audit Function
export const performForensicAudit = onCall(
  {
    region: REGION,
    secrets: ["GEMINI_API_KEY", "PLACES_API_KEY"],
    cors: ALLOWED_ORIGINS,
    timeoutSeconds: 30,
    memory: "256MiB"
  },
  async (request) => {
    const { bizName, location } = request.data;
    
    if (!bizName || typeof bizName !== 'string' || bizName.length < 2) {
      throw new HttpsError("invalid-argument", "Business name required (min 2 chars)");
    }
    if (!location || typeof location !== 'string' || location.length < 2) {
      throw new HttpsError("invalid-argument", "Location required (min 2 chars)");
    }

    logger.info(`Starting audit for: ${bizName} in ${location}`);

    try {
      // 1. FORENSIC MAPS EXTRACTION (Server-side only)
      const mapsRes = await fetch(
        "https://places.googleapis.com/v1/places:searchText",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": process.env.PLACES_API_KEY || "",
            "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri,places.formattedAddress,places.businessStatus"
          },
          body: JSON.stringify({
            textQuery: `${bizName} in ${location}`,
            maxResultCount: 3
          })
        }
      );

      if (!mapsRes.ok) {
        const errorText = await mapsRes.text();
        logger.error("Places API error:", errorText);
        throw new Error(`Places API failed: ${mapsRes.status}`);
      }

      const mapsData = await mapsRes.json();
      const biz = mapsData.places?.[0];
      
      const context = biz
        ? `VERIFIED ENTITY: ${biz.displayName?.text || bizName}. Rating: ${biz.rating || 'N/A'} stars, ${biz.userRatingCount || 0} reviews. Website: ${biz.websiteUri || 'None'}. Address: ${biz.formattedAddress || location}. Status: ${biz.businessStatus || 'Unknown'}.`
        : `INVISIBLE ENTITY: No Maps data found for "${bizName}" in ${location}. This indicates poor NAP consistency or unverified status.`;

      logger.info("Maps context:", context);

      // 2. STRATEGIC AI VERDICT
      const aiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are Hunter AI, a ruthless digital marketing strategist for Smart Marketing.

AUDIT TARGET: "${bizName}" in ${location}
REAL-TIME INTELLIGENCE: ${context}

TASK: Perform a Digital Entity Audit. Identify exactly 3 Trust Gaps. Rate "AI Visibility" from 0-100. Provide a 1-sentence survival strategy.

FORMAT (STRICT):
GAP 1: [Specific technical issue]
GAP 2: [Specific technical issue]
GAP 3: [Specific technical issue]
AI VISIBILITY SCORE: [0-100]
SURVIVAL STRATEGY: [One actionable sentence]
REQUIREMENT: [What they must fix immediately]
FINAL_SCORE: [number only]`
              }]
            }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 800
            }
          })
        }
      );

      if (!aiRes.ok) {
        const errorText = await aiRes.text();
        logger.error("Gemini API error:", errorText);
        throw new Error(`Gemini API failed: ${aiRes.status}`);
      }

      const aiData = await aiRes.json();
      const analysisText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "ANALYSIS UNAVAILABLE";
      
      logger.info("AI analysis completed");

      // Parse score
      const scoreMatch = analysisText.match(/FINAL_SCORE:\s*(\d+)/);
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 50;

      // Structure response
      const analysis = analysisText
        .split('\n')
        .filter(line => line.trim() && !line.includes('FINAL_SCORE:'))
        .map(line => {
          if (line.startsWith('GAP')) {
            return { heading: line.split(':')[0], content: line.split(':').slice(1).join(':').trim(), type: 'gap' };
          } else if (line.includes('AI VISIBILITY')) {
            return { heading: 'AI Visibility Rating', content: line.split(':').slice(1).join(':').trim(), type: 'score' };
          } else if (line.includes('SURVIVAL STRATEGY')) {
            return { heading: 'Survival Strategy', content: line.split(':').slice(1).join(':').trim(), type: 'strategy' };
          } else if (line.includes('REQUIREMENT')) {
            return { heading: 'Critical Requirement', content: line.split(':').slice(1).join(':').trim(), type: 'requirement' };
          }
          return { heading: 'Analysis', content: line, type: 'info' };
        });

      return {
        analysis,
        score,
        rawResponse: analysisText,
        mapsData: biz ? {
          name: biz.displayName?.text,
          rating: biz.rating,
          reviews: biz.userRatingCount,
          website: biz.websiteUri,
          address: biz.formattedAddress
        } : null
      };

    } catch (error) {
      logger.error("Audit failed:", error);
      throw new HttpsError(
        "internal",
        `Vault Handshake Failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
);

// Secure Chat Proxy
export const hunterChatProxy = onCall(
  {
    region: REGION,
    secrets: ["GEMINI_API_KEY"],
    cors: ALLOWED_ORIGINS,
    timeoutSeconds: 15,
    memory: "256MiB"
  },
  async (request) => {
    const { prompt, history = [] } = request.data;
    
    if (!prompt || typeof prompt !== 'string' || prompt.length < 1) {
      throw new HttpsError("invalid-argument", "Prompt is required");
    }
    if (prompt.length > 1000) {
      throw new HttpsError("invalid-argument", "Prompt too long (max 1000 chars)");
    }

    logger.info("Chat request received");

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are Hunter AI, the strategic assistant for Happy Hunter Digital Smart Marketing. You help South African SMEs with digital marketing, AI visibility, and Google Business Profile optimization.

CONTEXT: You are speaking to a potential client on the happyhunterdigital.com website.

CONVERSATION HISTORY: ${history.slice(-4).join('\n')}

USER QUERY: ${prompt}

GUIDELINES:
- Be direct, strategic, and slightly aggressive in tone
- Use terms like "Entity", "Protocol", "Handshake", "AI Visibility"
- Keep responses under 150 words
- If they need specific analysis, direct them to the Entity Scan
- Never use markdown asterisks for bold

RESPOND NOW:`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500
            }
          })
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        logger.error("Gemini chat error:", errorText);
        throw new Error(`Chat API failed: ${res.status}`);
      }

      const data = await res.json();
      const response = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        "Signal interrupted. Please try the Entity Scan for a full analysis.";

      return { response };

    } catch (error) {
      logger.error("Chat failed:", error);
      throw new HttpsError("internal", "Chat protocol failed");
    }
  }
);
