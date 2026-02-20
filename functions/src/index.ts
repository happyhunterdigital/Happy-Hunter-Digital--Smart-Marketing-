import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

admin.initializeApp();
const db = getFirestore();

// 1. SMART MARKETING AUDIT
export const performAudit = onCall({
  region: "us-central1",
  cors: true,
  maxInstances: 10,
}, async (request) => {
  const { businessName, location, clientEmail } = request.data;

  const G_KEY = process.env.GEMINI_API_KEY;
  const P_KEY = process.env.PLACES_API_KEY;

  if (!businessName || !location || !clientEmail) {
    throw new HttpsError("invalid-argument", "Missing required fields.");
  }
  if (!G_KEY || !P_KEY) {
    throw new HttpsError("failed-precondition", "API keys not configured.");
  }

  try {
    const pRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": P_KEY },
      body: JSON.stringify({ textQuery: `${businessName} in ${location}` })
    });

    const pData = await pRes.json() as any;
    const biz = pData.places?.[0];
    const context = biz
      ? `Data Found: ${biz.displayName?.text}. Rating: ${biz.rating || 'N/A'}. Reviews: ${biz.userRatingCount || 0}. Status: ${biz.businessStatus}.`
      : `No Google Maps data found for "${businessName}" in ${location}.`;

    let analysis;
    
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an expert Digital Marketing Strategist. Analyze: ${businessName}. Context: ${context}. Rate visibility 0-100. Identify 3 growth areas. Output STRICT JSON: { "score": number, "summary": "string", "truths": ["string", "string", "string"] }`
          }]
        }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (aiRes.status === 429) {
      console.warn("Audit Rate Limit Hit. Using Fallback.");
      analysis = {
        score: biz ? 55 : 35,
        summary: `Our AI is experiencing high traffic. Based on a rapid scan, ${businessName} shows opportunities for significant growth in local search visibility.`,
        truths: [
          "Optimize Google Business Profile categories for your specific niche.",
          "Implement a strategy to consistently gather new, high-quality customer reviews.",
          "Ensure your business Name, Address, and Phone (NAP) are identical across all online directories."
        ]
      };
    } else if (!aiRes.ok) {
      throw new Error(`AI error: ${aiRes.status}`);
    } else {
      const aiData = await aiRes.json() as any;
      analysis = JSON.parse(aiData.candidates[0].content.parts[0].text);
    }

    const emailHtml = `...`; // Email logic remains
    await db.collection("mail").add({
      to: [clientEmail],
      message: {
        subject: `Your Marketing Audit Results: ${businessName}`,
        html: emailHtml,
      },
    });

    await db.collection("leads").add({ businessName, location, email: clientEmail, score: analysis.score, timestamp: admin.firestore.FieldValue.serverTimestamp() });

    return { success: true, score: analysis.score, summary: analysis.summary, truths: analysis.truths };

  } catch (e: any) {
    console.error("Audit Failure:", e);
    throw new HttpsError("internal", `Audit failed. Please try again.`);
  }
});

// 2. STRATEGIC CHAT (UPGRADED WITH FALLBACK)
export const hunterChat = onCall({
  region: "us-central1",
  cors: true,
  maxInstances: 10,
}, async (request) => {
  const { message } = request.data;
  const G_KEY = process.env.GEMINI_API_KEY;

  if (!message || !G_KEY) {
    throw new HttpsError("invalid-argument", "Invalid request.");
  }

  try {
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a helpful, professional digital marketing assistant for Happy Hunter Systems. User says: "${message}". Respond in 1-2 friendly sentences.`
          }]
        }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 150 }
      })
    });
    
    // THE FIX: Check for rate limit and provide a smart fallback
    if (aiRes.status === 429) {
        console.warn("Chatbot Rate Limit Hit. Using Fallback.");
        return { success: true, reply: "Our AI is handling a high volume of requests at the moment. Please try the Smart Marketing Scan above for a detailed analysis, or ask me again in a minute!" };
    }

    if (!aiRes.ok) {
        throw new Error(`AI error: ${aiRes.status}`);
    }

    const data = await aiRes.json() as any;
    return { success: true, reply: data.candidates[0].content.parts[0].text.trim() };

  } catch (e: any) {
    // This is the generic crash error
    console.error("Chat Failure:", e);
    return { success: true, reply: "My connection is unstable at the moment. For immediate help, please email our team at hello@happyhunterdigital.com" };
  }
});
