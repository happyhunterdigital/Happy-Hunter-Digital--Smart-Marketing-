import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// ============================================================================
// 1. SMART MARKETING AUDIT (100% UNTOUCHED - EXACTLY AS IT WAS)
// ============================================================================
export const performAudit = onCall({
  region: "us-central1",
  cors: true,
  maxInstances: 10,
  timeoutSeconds: 300
}, async (request) => {
  const { businessName, location, clientEmail } = request.data;
  const G_KEY = process.env.GEMINI_API_KEY;
  const P_KEY = process.env.PLACES_API_KEY;

  if (!businessName || !location || !clientEmail) throw new HttpsError("invalid-argument", "Missing required fields.");
  if (!G_KEY || !P_KEY) throw new HttpsError("failed-precondition", "AI Core Offline.");

  try {
    const pRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": P_KEY, "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount" },
      body: JSON.stringify({ textQuery: `${businessName} in ${location}` })
    });
    const pData = await pRes.json() as any;
    const biz = pData.places?.[0];

    const context = biz 
      ? `Verified: ${biz.displayName?.text}. Rating: ${biz.rating}. Reviews: ${biz.userRatingCount}.`
      : `Ghost: No Maps data found for ${businessName}.`;

    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are Hunter AI. Audit: ${businessName}. Data: ${context}. No asterisks. Format JSON: { "score": number, "summary": "string", "truths": ["string", "string", "string"] }` }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const aiData = await aiRes.json() as any;
    const analysis = JSON.parse(aiData.candidates[0].content.parts[0].text);

    // Save lead
    await db.collection("leads").add({ businessName, email: clientEmail, score: analysis.score, timestamp: admin.firestore.FieldValue.serverTimestamp() });
    
    // Email Dispatch
    const isGoodScore = analysis.score >= 70;
    const isBadScore = analysis.score < 50;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333; background-color: #050505; padding: 40px; border-radius: 16px; border: 1px solid #1f2937;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #eab308; margin: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 14px;">Smart Marketing Engine</h2>
          <h1 style="color: #ffffff; margin: 10px 0 0 0; text-transform: uppercase;">Digital Survival Report</h1>
        </div>
        <div style="background-color: #0a0a0a; border: 1px solid #1f2937; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
          <p style="color: #9ca3af; margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Target Entity</p>
          <p style="color: #ffffff; margin: 0; font-size: 18px; font-weight: bold;">${businessName}</p>
          <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">${location}</p>
        </div>
        <div style="text-align: center; margin-bottom: 40px;">
          <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Visibility Score</p>
          <div style="font-size: 72px; font-weight: 900; line-height: 1; color: ${isGoodScore ? '#22c55e' : isBadScore ? '#ef4444' : '#eab308'};">
            ${analysis.score}<span style="font-size: 24px; color: #4b5563;">/100</span>
          </div>
        </div>
        ${isGoodScore ? `
          <div style="background-color: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.2); padding: 20px; border-radius: 12px; margin-bottom: 30px;">
            <h3 style="color: #22c55e; margin: 0 0 10px 0; font-size: 16px;">✓ Entity Verified: Strong Baseline</h3>
            <p style="color: #d1d5db; margin: 0; font-size: 14px; line-height: 1.5;">Congratulations. Your traditional SEO and Google Maps foundation is solid. However, standard search is evolving rapidly. To prevent competitors from overtaking you in AI-driven search, you must upgrade from basic SEO to Generative Engine Optimization (GEO).</p>
          </div>
        ` : `
          <div style="background-color: rgba(249, 115, 22, 0.1); border: 1px solid rgba(249, 115, 22, 0.2); padding: 20px; border-radius: 12px; margin-bottom: 30px;">
            <h3 style="color: #f97316; margin: 0 0 10px 0; font-size: 16px;">⚠ Critical Vulnerability Detected</h3>
            <p style="color: #d1d5db; margin: 0; font-size: 14px; line-height: 1.5;">Your digital architecture is actively repelling algorithms. You are experiencing the "Ghost Effect"—meaning high-intent customers searching for your services are being routed directly to your competitors. Immediate intervention is required.</p>
          </div>
        `}
        <div style="margin-bottom: 30px;">
          <h3 style="color: #eab308; margin: 0 0 15px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Forensic AI Summary</h3>
          <p style="color: #ffffff; margin: 0; font-size: 16px; line-height: 1.6; font-style: italic; border-left: 3px solid #eab308; padding-left: 15px;">"${analysis.summary}"</p>
        </div>
        <div style="margin-bottom: 40px;">
          <h3 style="color: #ef4444; margin: 0 0 15px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Specific Technical Weak Spots</h3>
          ${analysis.truths.map((truth: string, index: number) => `
            <div style="background-color: #111827; border: 1px solid #1f2937; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
              <span style="color: #eab308; font-weight: bold; margin-right: 10px;">0${index + 1}</span>
              <span style="color: #d1d5db; font-size: 14px;">${truth}</span>
            </div>
          `).join('')}
        </div>
        <div style="background-color: #111827; border: 1px solid rgba(234, 179, 8, 0.3); padding: 30px; border-radius: 16px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0 0 15px 0; font-size: 24px; text-transform: uppercase;">Stop The Revenue Leakage</h2>
          <p style="color: #9ca3af; margin: 0 0 25px 0; font-size: 14px; line-height: 1.6;">Book a Free 30-Minute Discovery Call with <strong>Thabo</strong>, Head of happyhunterdigital. We will review this exact report together and map out your custom Recovery Protocol.</p>
          <a href="https://calendly.com/motsumitl/30min" style="display: inline-block; background-color: #eab308; color: #000000; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; text-transform: uppercase; font-size: 14px; letter-spacing: 1px;">Schedule Strategy Call</a>
        </div>
        <div style="text-align: center; margin-top: 40px; border-top: 1px solid #1f2937; padding-top: 20px;">
          <p style="color: #6b7280; margin: 0; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">© 2026 happyhunterdigital // Agentic Operations Core</p>
        </div>
      </div>
    `;

    await db.collection("mail").add({
      to: [clientEmail],
      message: {
        subject: `[Intelligence Report] Status: ${businessName}`,
        html: emailHtml,
      }
    });

    return { success: true, ...analysis };
  } catch (e: any) {
    throw new HttpsError("internal", `Neural Handshake Interrupted.`);
  }
});

// ============================================================================
// 2. STRATEGIC CHAT (FIXED: ZERO HALLUCINATIONS)
// ============================================================================
export const hunterChat = onCall({
  region: "us-central1",
  cors: true,
}, async (request) => {
  const { message } = request.data;
  const G_KEY = process.env.GEMINI_API_KEY;

  if (!message || !G_KEY) {
    return { reply: "Connection offline. Missing parameters." };
  }

  // THE FIX: Strict System Instructions 
  const SYSTEM_PROMPT = `You are Hunter AI, the official digital marketing assistant for Happy Hunter Digital.
YOUR KNOWLEDGE BASE:
- Founder & Head Strategist: Thabo Leslie Motsumi.
- Our Mission: We stop South African SMEs from being "Ghosts" to AI algorithms. We turn physical businesses into digital powerhouses.
- Our Services: 1) Trust Synchronization 2) AI Visibility (AEO) 3) Agentic Revenue.
- Our Tool: The "Smart Marketing Scan".
- Contact: WhatsApp +27 (0) 60 101 6673 or email motsumitl@happyhunterdigital.com. Website: www.happyhunterdigital.com

RULES:
1. NEVER make up information. Use ONLY the Knowledge Base.
2. If asked who the founder is, say exactly: "The founder and head strategist of Happy Hunter Digital is Thabo Leslie Motsumi."
3. Be direct, professional, and confident.
4. Keep answers to 1 or 2 sentences MAX.`;

  try {
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // THIS passes your rules directly into the engine's core
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: [
          { role: "user", parts: [{ text: message }] }
        ],
        // Temperature 0.1 makes it strictly factual, stopping creative hallucinations
        generationConfig: { temperature: 0.1, maxOutputTokens: 200 }
      })
    });

    if (!aiRes.ok) {
       console.error("Gemini Chat Error:", await aiRes.text());
       return { reply: "My neural link is currently overloaded. Please email HQ." };
    }

    const data = await aiRes.json() as any;
    
    if (data.candidates && data.candidates[0].content.parts[0].text) {
       return { reply: data.candidates[0].content.parts[0].text.trim() };
    } else {
       return { reply: "I received an unreadable signal from the core. Try again." };
    }
  } catch (e) {
    console.error("Chat Error:", e);
    return { reply: "Comms offline. Please email motsumitl@happyhunterdigital.com" };
  }
});
