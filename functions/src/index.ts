import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import axios from "axios";
import * as cheerio from "cheerio";

admin.initializeApp();
const db = getFirestore();

// ============================================================================
// SYSTEM CONSTANTS
// ============================================================================
const AI_MODEL = "gemini-3.1-flash-lite-preview";
const EMBEDDING_MODEL = "gemini-embedding-2-preview";

// ============================================================================
// 1. SMART MARKETING AUDIT (DEEP SCHEMA SCRAPER + HIJACK DETECTION)
// ============================================================================
export const performAudit = onCall({
  region: "us-central1",
  cors: true,
  maxInstances: 10,
  timeoutSeconds: 300
}, async (request) => {
  const { businessName, location, clientEmail, whatsapp } = request.data;
  
  const G_KEY = process.env.GEMINI_API_KEY;
  const P_KEY = process.env.PLACES_API_KEY;

  if (!businessName || !location || !clientEmail) throw new HttpsError("invalid-argument", "Missing required fields.");
  if (!G_KEY || !P_KEY) throw new HttpsError("failed-precondition", "AI Core Offline.");

  try {
    const getPlaces = async (query: string) => {
      const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": P_KEY,
          "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri"
        },
        body: JSON.stringify({ textQuery: query })
      });
      return res.json() as any;
    };

    let pData = await getPlaces(`${businessName} in ${location}`);
    let biz = pData?.places?.[0] || null;

    if (!biz) {
      pData = await getPlaces(businessName);
      biz = pData?.places?.[0] || null;
    }

    const websiteUrl = biz?.websiteUri || null;
    
    let detectedSchemas: string[] = [];
    let hasSchema = false;

    if (websiteUrl) {
      try {
        const webRes = await axios.get(websiteUrl, {
          timeout: 6000,
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" }
        });
        const $ = cheerio.load(webRes.data);

        $('script[type="application/ld+json"]').each((_, element) => {
          hasSchema = true;
          try {
            const jsonData = JSON.parse($(element).html() || "{}");

            const extractType = (obj: any) => {
              if (!obj) return;
              if (Array.isArray(obj)) {
                obj.forEach(extractType);
              } else if (typeof obj === 'object') {
                if (obj['@type']) detectedSchemas.push(obj['@type']);
                if (obj['@graph']) extractType(obj['@graph']);
              }
            };

            extractType(jsonData);
          } catch(e) { }
        });

        detectedSchemas = [...new Set(detectedSchemas)];
        if (detectedSchemas.length === 0 && hasSchema) detectedSchemas = ["Valid Schema (Unknown Type)"];

      } catch (err) {
        console.log("Web scrape failed or timed out for:", websiteUrl);
      }
    }

    const schemaString = detectedSchemas.length > 0 ? `Detected JSON-LD Schemas: ${detectedSchemas.join(", ")}` : "No Schema Markup detected.";
    const bizNameStr = biz?.displayName?.text || "NONE FOUND";

    let context = "";
    if (!biz) {
      context = `GHOST ENTITY: No Google Maps data found for "${businessName}". No Website verified. ${schemaString}`;
    } else {
      context = `
 - User Searched For: "${businessName}"
 - Google Maps Returned: "${bizNameStr}"
 - Maps Rating: ${biz.rating || 0} (${biz.userRatingCount || 0} reviews)
 - Website Linked in Maps: ${websiteUrl || 'NONE LINKED'}
 - ${schemaString}
 `;
    }

    const RUBRIC = `
 SCORING RUBRIC (0-100):
 - Baseline 30.
 - Verified Maps Entity (Names Match Exactly): +20 points.
 - Rating >= 4.0: +15 points.
 - Schema Markup Detected (true): +25 points (Crucial for AEO).
 - Ghost Entity OR No Schema: Deduct 30 points.
 `;

    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts:[{ text: `You are Hunter AI. Audit: ${businessName}. Data Context: ${context}. ${RUBRIC} Format JSON: { "score": number, "summary": "string", "truths": ["string", "string", "string"] }` }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error(`Gemini Audit API Error (${AI_MODEL}):`, errText);
      throw new Error(`AI API Error: ${aiRes.status}`);
    }

    const aiData = await aiRes.json() as any;
    const analysis = JSON.parse(aiData.candidates[0].content.parts[0].text);

    const isHijacked = (biz && analysis.score === 0);

    const telemetry = {
      mapsStatus: !biz ? "GHOST (NOT FOUND)" : isHijacked ? "HIJACKED (COMPETITOR FOUND)" : "VERIFIED",
      website: websiteUrl || "None Linked",
      schema: hasSchema,
      schemasDetected: detectedSchemas
    };

    await db.collection("leads").add({ businessName, email: clientEmail, whatsapp: whatsapp || null, score: analysis.score, timestamp: admin.firestore.FieldValue.serverTimestamp() });

    const isGoodScore = analysis.score >= 70;
    const emailHtml = `<div style="font-family: Arial, sans-serif; background-color: #050505; color: #fff; padding: 40px; text-align: center;">
 <h1 style="color: ${isGoodScore ? '#22c55e' : '#eab308'};">Digital Survival Score: ${analysis.score}/100</h1>
 <p>${analysis.summary}</p>
 </div>`;

    await db.collection("mail").add({ to: [clientEmail], message: { subject: `[Intelligence Report] Status: ${businessName}`, html: emailHtml } });

    return { success: true, ...analysis, telemetry };

  } catch (e: any) {
    throw new HttpsError("internal", `Neural Handshake Interrupted. ${e.message}`);
  }
});


// ============================================================================
// 2. STRATEGIC CHAT
// ============================================================================
export const hunterChat = onCall({
  region: "us-central1",
  cors: true,
}, async (request) => {
  const { message } = request.data;
  const G_KEY = process.env.GEMINI_API_KEY;

  if (!message || !G_KEY) {
    return { reply: "<p>Connection offline. Missing parameters.</p>" };
  }

  const SYSTEM_PROMPT = `You are the Smart Marketing AI, the official digital marketing AI assistant for Happy Hunter Digital.
 YOUR KNOWLEDGE BASE:
 - Founder & Head Strategist: Thabo Motsumi.
 - Our Mission: We stop South African SMEs from being "Ghosts" to AI algorithms. We turn physical businesses into digital powerhouses via Generative Engine Optimization (GEO).
 - Contact: Email motsumitl@happyhunterdigital.com.

 RULES:
 1. NEVER hallucinate. Use ONLY the Knowledge Base.
 2. Be direct, professional, and authoritative. Keep answers concise.
 3. Use HTML tags (<strong>, <p>, <a>) for ALL formatting. Do NOT use markdown.
 4. Every response must end with: <p>Continue this conversation with our <a href="https://wa.me/27833927457" target="_blank" style="color: #eab308; text-decoration: underline; font-weight: bold;">Smart Marketing AI</a> on WhatsApp.</p>`;

  try {
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts:[{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: message }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 500 }
      })
    });

    if (!aiRes.ok) {
      const errorText = await aiRes.text();
      console.error(`Gemini Chat API Error (${AI_MODEL}):`, errorText);
      return { reply: "<p>My neural link is currently overloaded. Please email HQ.</p>" };
    }

    const data = await aiRes.json() as any;
    if (data.candidates && data.candidates[0].content.parts[0].text) return { reply: data.candidates[0].content.parts[0].text.trim() };
    return { reply: "<p>I received an unreadable signal from the core. Try again.</p>" };
  } catch (e) {
    return { reply: "<p>Comms offline. Please email motsumitl@happyhunterdigital.com</p>" };
  }
});


// ==========================================
// 3. LANDING PAGE SERVICE REQUEST (AUTO EMAIL)
// ==========================================
export const submitServiceRequest = onCall({
  region: "us-central1",
  cors: true,
}, async (request) => {
  const { name, website, service, email } = request.data;
  if (!name || !email || !service) throw new HttpsError("invalid-argument", "Missing required fields.");

  try {
    await db.collection("leads").add({
      name,
      website: website || "Not provided",
      service,
      email,
      source: "AI Megaphone Landing Page",
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    let dynamicProblem = "You have digital assets, but they aren't working together as a cohesive ecosystem.";
    if (service.includes("RAG-Ready")) dynamicProblem = "Your brand is present online, but AI models aren't citing you as the expert source yet.";
    else if (service.includes("Governance")) dynamicProblem = "Your digital footprint is fragmented, making it hard for Google to verify your authority.";

    const firstName = name.split(' ')[0] || 'there';
    const emailHtml = `
 <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; line-height: 1.6; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
 <p style="font-size: 16px;">Hi ${firstName},</p>
 <p style="font-size: 16px;">Welcome to the hunt for smarter growth.</p>
 <p style="font-size: 16px;">I noticed you were looking into <strong>${service}</strong>. In 2026, if you aren't being synthesized into AI answers, you're effectively invisible.</p>
 <p style="font-size: 16px;"><strong>The Problem We Identified:</strong> ${dynamicProblem}</p>
 <div style="background-color: #050505; color: #fff; padding: 30px; text-align: center; border-radius: 12px;">
 <h3 style="color: #eab308; margin-top: 0;">What's Next?</h3>
 <a href="https://calendly.com/motsumitl/30min" style="background-color: #eab308; color: #000; padding: 16px 32px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">Book Strategy Session</a>
 </div>
 </div>`;

    await db.collection("mail").add({
      to: [email],
      message: { subject: `Regarding your interest in ${service}`, html: emailHtml }
    });

    return { success: true };
  } catch (error: any) {
    throw new HttpsError("internal", `System Engine Failed. ${error.message}`);
  }
});


// ==========================================
// 4. ENTITY ORCHESTRATION ENGINE (JSON-LD)
// ==========================================
export const compileEntitySchema = onDocumentWritten("brand_identity/{docId}", async (event) => {
  try {
    const brandSnapshot = await db.collection("brand_identity").limit(1).get();
    if (brandSnapshot.empty) return null;

    const brandData = brandSnapshot.docs[0].data();
    const aeoSnapshot = await db.collection("aeo_knowledge").where("speakable", "==", true).get();

    const faqItems = aeoSnapshot.docs.map(doc => {
      const data = doc.data();
      return { "@type": "Question", "name": data.question, "acceptedAnswer": { "@type": "Answer", "text": data.answer } };
    });

    const claimsSnapshot = await db.collection("verified_claims").get();
    const offerItems = claimsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": data.serviceName || "Digital Protocol",
          "description": data.serviceDescription || "Verified AI Marketing Solutions",
          "subjectOf": {
            "@type": "ClaimReview",
            "claimReviewed": data.claim || "AI-Ready Digital Infrastructure",
            "reviewRating": { "@type": "Rating", "ratingValue": data.rating || "5", "bestRating": "5" },
            "author": { "@type": "Organization", "name": data.authorName || "Happy Hunter Systems Verification" },
            "itemReviewed": { "@type": "CreativeWork", "name": data.evidenceName || "System Audit", "url": data.evidenceUrl || "https://www.happyhunterdigital.com/audit" }
          }
        }
      };
    });

    const masterSchema: any = {
      "@context": "https://schema.org",
      "@graph":[
        {
          "@type": brandData.orgType || "LocalBusiness",
          "@id": `${brandData.websiteUrl || "https://www.happyhunterdigital.com"}#organization`,
          "name": brandData.legalName || "Happy Hunter Digital",
          "telephone": brandData.telephone || "+27 60 101 6673",
          "sameAs": brandData.sameAs || ["https://www.facebook.com/Happyhunterdigital/", "https://za.linkedin.com/in/thabomotsumi"]
        }
      ]
    };

    if (offerItems.length > 0) masterSchema["@graph"][0]["hasOfferCatalog"] = { "@type": "OfferCatalog", "name": "Services", "itemListElement": offerItems };
    if (faqItems.length > 0) masterSchema["@graph"].push({ "@type": "FAQPage", "mainEntity": faqItems });

    await db.collection("public_seo").doc("master_schema").set({ compiled_json_ld: JSON.stringify(masterSchema) });
    return null;
  } catch (error) {
    return null;
  }
});


// ============================================================================
// 5. WHATSAPP "SMART MARKETING AI" WEBHOOK (MULTIMODAL VECTOR SEARCH + GENERATIVE AI)
// ============================================================================
const WHATSAPP_TOKEN = process.env.META_SYSTEM_TOKEN || process.env.WHATSAPP_TOKEN || '';
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || '';
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'HAPPY_HUNTER_SECURE_2026';
const ADMIN_NUMBER = "27601016673";

export const whatsappWebhook = onRequest(async (req, res) => {
  if (req.method === 'GET') {
    if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
      res.status(200).send(req.query['hub.challenge']);
    } else {
      res.status(403).send('Verification failed');
    }
    return;
  }

  if (req.method === 'POST') {
    if (req.body?.object === 'whatsapp_business_account') {
      const entry = req.body.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;
      const message = value?.messages?.[0];

      if (message && message.type === 'text') {
        const userText = message.text.body; // Retain original casing for Generative AI context
        const from = message.from;
        const G_KEY = process.env.GEMINI_API_KEY;
        
        // Base fallback in case of complete system failure
        let botResponse = "My neural link is updating. To speak with our Head Strategist immediately, tap here: https://wa.me/27601016673";
        let matchedData: any = null;

        if (G_KEY && userText) {
          try {
            const embedRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${G_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: `models/${EMBEDDING_MODEL}`,
                    content: { parts: [{ text: userText.toLowerCase() }] }
                })
            });
            const embedData = await embedRes.json() as any;
            if (embedData.embedding?.values) {
                const vectorQuery = await db.collection('verified_claims').findNearest('embedding_vector', admin.firestore.FieldValue.vector(embedData.embedding.values), {
                    limit: 1,
                    distanceMeasure: 'COSINE'
                }).get();
                if (!vectorQuery.empty) matchedData = vectorQuery.docs[0].data();
            }
          } catch (e) { console.error("Embedding Error", e); }
        }

        if (matchedData) {
          botResponse = `✅ *Official Info:* ${matchedData.content || matchedData.verified_answer}`;
        } else if (G_KEY) {
          // ==========================================================
          // GENERATIVE AI FALLBACK (Triggered if no Vector Data exists)
          // ==========================================================
          const WA_SYSTEM_PROMPT = `You are Smart Marketing AI, the official WhatsApp assistant for Happy Hunter Digital.
YOUR KNOWLEDGE BASE:
- Founder & Head Strategist: Thabo Motsumi.
- Mission: We stop South African SMEs from being "Ghosts" to AI algorithms via Generative Engine Optimization (GEO).
- Services & Pricing: Phase 1 Agentic Websites (R4,500 - R55,000+), Phase 2 Local Search Dominance (R5,500/mo), Phase 3 Social Media Ads (R3,500/mo), Phase 4 Custom Chatbots (R10,000+).
- Primary Tool: "Smart Marketing Scan" (Digital Survival Score) at happyhunterdigital.com/audit.
RULES:
1. Answer concisely, keeping it WhatsApp-friendly (short paragraphs, use emojis).
2. Be conversational, professional, and slightly authoritative.
3. If they ask a complex question, want to book a meeting, or if you don't have the answer, ALWAYS offer to connect them to Thabo using this EXACT link: https://wa.me/27601016673`;

          try {
            const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent?key=${G_KEY}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                systemInstruction: { parts:[{ text: WA_SYSTEM_PROMPT }] },
                contents: [{ role: "user", parts: [{ text: userText }] }],
                generationConfig: { temperature: 0.2, maxOutputTokens: 300 }
              })
            });
            const data = await aiRes.json() as any;
            if (data.candidates && data.candidates[0].content.parts[0].text) {
              botResponse = data.candidates[0].content.parts[0].text.trim();
            }
          } catch (fallbackErr) {
            console.error("Generative Fallback Error:", fallbackErr);
          }
        }

        try {
          await axios.post(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
            messaging_product: "whatsapp", to: from, text: { body: botResponse }
          }, { headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}` } });
        } catch (sendError: any) {
          console.error("WhatsApp Transmission Error:", sendError.response?.data || sendError.message);
        }
      }
      res.status(200).send('EVENT_RECEIVED');
      return;
    }
  }
  res.status(404).send();
  return;
});


// ============================================================================
// 6. DAILY REVENUE REPORT
// ============================================================================
export const dailyRevenueReport = onSchedule("every day 08:00", async (event) => {
  console.log("Daily report routine checked.");
});

// ============================================================================
// 7. TRUTH TABLE VECTORIZER (GEMINI EMBEDDING 2 PREVIEW)
// ============================================================================
export const vectorizeClaim = onDocumentWritten("verified_claims/{docId}", async (event) => {
    const doc = event.data?.after.data();
    if (!doc || !doc.content) return;
    if (event.data?.before.data()?.content === doc.content && doc.embedding_vector) return;

    const G_KEY = process.env.GEMINI_API_KEY;
    if (!G_KEY) return;

    try {
        const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${G_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: `models/${EMBEDDING_MODEL}`,
                content: { parts: [{ text: doc.content }] } 
            })
        });
        const data = await aiRes.json() as any;
        if (data.embedding?.values) {
            await event.data?.after.ref.update({
                embedding_vector: admin.firestore.FieldValue.vector(data.embedding.values)
            });
        }
    } catch (error) {
        console.error("Vectorization Failed:", error);
    }
});
