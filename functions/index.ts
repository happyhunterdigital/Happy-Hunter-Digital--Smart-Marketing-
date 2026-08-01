import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import axios from "axios";
import * as cheerio from "cheerio";
import * as crypto from "crypto";

admin.initializeApp();
const db = getFirestore();

const AI_MODEL = "gemini-1.5-flash";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SAFE_PHONE_REGEX = /^\+[1-9]\d{6,14}$/;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_BUSINESS_NAME_LENGTH = 200;
const MAX_LOCATION_LENGTH = 200;
const RATE_LIMIT_WINDOW_MS = 60_000;
const AUDIT_RATE_LIMIT = 5;
const CHAT_RATE_LIMIT = 20;
const SERVICE_RATE_LIMIT = 10;

function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email) && email.length <= 254;
}

function sanitizeInput(input: string, maxLen: number): string {
  if (!input || typeof input !== "string") return "";
  return input.trim().slice(0, maxLen).replace(/[<>]/g, "");
}

async function checkRateLimit(collection: string, identifier: string, maxRequests: number): Promise<void> {
  const key = `${identifier}_${Math.floor(Date.now() / RATE_LIMIT_WINDOW_MS)}`;
  const ref = db.collection(collection).doc(key);
  const doc = await ref.get();
  const count = doc.exists ? (doc.data()?.count || 0) : 0;
  if (count >= maxRequests) {
    throw new HttpsError("resource-exhausted", "Rate limit exceeded. Try again shortly.");
  }
  await ref.set({ count: count + 1, lastAccess: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
}

const SAFETY_SETTINGS = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_LOW_AND_ABOVE" }
];

function isValidFetchUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    const host = parsed.hostname.toLowerCase();
    if (host === 'localhost' || host === '127.0.0.1' || host === '::1') return false;
    if (host.startsWith('169.254.') || host.startsWith('10.') || host.startsWith('192.168.') || host.startsWith('172.')) return false;
    if (host.endsWith('.local') || host.endsWith('.internal') || host === 'metadata.google.internal') return false;
    return /^[a-zA-Z0-9.-]+\.[a-z]{2,}$/.test(host);
  } catch { return false; }
}

function htmlescape(str: string): string {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

// ============================================================================
// 1. SMART MARKETING AUDIT (DEEP SCHEMA SCRAPER + HIJACK DETECTION)
// ============================================================================
export const performAudit = onCall({
  region: "us-central1",
  cors: true,
  maxInstances: 10,
  timeoutSeconds: 300,
  enforceAppCheck: true
}, async (request) => {
  const rawBusinessName = request.data?.businessName;
  const rawLocation = request.data?.location;
  const rawClientEmail = request.data?.clientEmail;
  const rawWhatsapp = request.data?.whatsapp;

  const businessName = sanitizeInput(rawBusinessName, MAX_BUSINESS_NAME_LENGTH);
  const location = sanitizeInput(rawLocation, MAX_LOCATION_LENGTH);
  const clientEmail = (rawClientEmail || "").trim().toLowerCase().slice(0, 254);
  const whatsapp = rawWhatsapp ? rawWhatsapp.trim().slice(0, 20) : "";

  const G_KEY = process.env.GEMINI_API_KEY;
  const P_KEY = process.env.PLACES_API_KEY;

  if (!businessName || !location || !clientEmail) throw new HttpsError("invalid-argument", "Missing required fields.");
  if (!validateEmail(clientEmail)) throw new HttpsError("invalid-argument", "Invalid email format.");
  if (whatsapp && !SAFE_PHONE_REGEX.test(whatsapp)) throw new HttpsError("invalid-argument", "Invalid phone format.");
  if (!G_KEY || !P_KEY) throw new HttpsError("failed-precondition", "AI Core Offline.");

  const clientIP = request.rawRequest?.ip || request.rawRequest?.headers?.["x-forwarded-for"] || "unknown";
  await checkRateLimit("rate_limit_audit", String(clientIP), AUDIT_RATE_LIMIT);

  try {
    const getPlaces = async (query: string) => {
      const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": P_KEY,
          "X-Goog-FieldMask": "places.id,places.displayName,places.rating,places.userRatingCount,places.websiteUri,places.formattedAddress,places.internationalPhoneNumber",
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
    
    let detectedSchemas: string[] =[];
    let hasSchema = false;

    if (websiteUrl) {
      if (!isValidFetchUrl(websiteUrl)) {
        console.warn("SSRF blocked: invalid or internal URL", websiteUrl);
      } else {
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

 CRITICAL TRAFFIC HIJACK INSTRUCTION:
 If the "User Searched For" name and the "Google Maps Returned" name are fundamentally different businesses (e.g. "IntegratedWellth" vs "Integrated Health"), you MUST treat this as a TRAFFIC HIJACK.
 If hijacked, set their total score to 0. Do NOT praise the competitor's rating. In your summary, explicitly state that because their digital footprint is weak, Google algorithms are routing their high-intent customers directly to a competitor named "[Google Maps Returned name]". Agitate this pain point.

 INSTRUCTIONS FOR 'truths' ARRAY (Must be exactly 3 items):
 Truth 1: State if they are Verified, a Ghost, or if a Traffic Hijack occurred (name the competitor).
 Truth 2: Mention their Website status (If NO website is linked, state it is a critical algorithmic failure).
 Truth 3: Explicitly list the AI Schema Markup (JSON-LD) types found (${detectedSchemas.join(", ")}) or state it is completely missing.
 `;

    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts:[{ text: `You are Hunter AI. Audit: ${businessName}. Data Context: ${context}. ${RUBRIC} Format JSON: { "score": number, "summary": "string", "truths":["string", "string", "string"] }` }] }],
        generationConfig: { responseMimeType: "application/json" },
        safetySettings: SAFETY_SETTINGS
      })
    });

    const aiData = await aiRes.json() as any;
    const analysis = JSON.parse(aiData.candidates[0].content.parts[0].text);

    const isHijacked = (biz && analysis.score === 0);

    const telemetry = {
      mapsStatus: !biz ? "GHOST (NOT FOUND)" : isHijacked ? "HIJACKED (COMPETITOR FOUND)" : "VERIFIED",
      mapsName: biz?.displayName?.text || null,
      rating: biz?.rating || null,
      reviewCount: biz?.userRatingCount || null,
      gbpOnly: !websiteUrl,
      gbpUrl: biz ? `https://search.google.com/local/reviews?placeid=${biz.place_id || ''}` : '',
      website: websiteUrl || "None Linked",
      schema: hasSchema,
      schemasDetected: detectedSchemas
    };

    await db.collection("leads").add({ businessName, email: clientEmail, whatsapp: whatsapp || null, score: analysis.score, timestamp: admin.firestore.FieldValue.serverTimestamp() });

    const isGoodScore = analysis.score >= 70;
    const emailHtml = `<div style="font-family: Arial, sans-serif; background-color: #050505; color: #fff; padding: 40px; text-align: center;">
 <h1 style="color: ${isGoodScore ? '#22c55e' : '#eab308'};">Digital Survival Score: ${Number(analysis.score)}/100</h1>
 <p>${htmlescape(analysis.summary)}</p>
 </div>`;

    await db.collection("mail").add({ to: [clientEmail], message: { subject: `[Intelligence Report] Status: ${htmlescape(String(businessName))}`, html: emailHtml } });

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
  enforceAppCheck: true
}, async (request) => {
  const { message } = request.data;
  const G_KEY = process.env.GEMINI_API_KEY;

  if (!message || !G_KEY) {
    return { reply: "Connection offline. Missing parameters." };
  }

  const sanitizedMessage = String(message).trim().slice(0, MAX_MESSAGE_LENGTH);
  if (!sanitizedMessage) return { reply: "Please enter a valid message." };

  const clientIP = request.rawRequest?.ip || request.rawRequest?.headers?.["x-forwarded-for"] || "unknown";
  try {
    await checkRateLimit("rate_limit_chat", String(clientIP), CHAT_RATE_LIMIT);
  } catch {
    return { reply: "You're sending messages too quickly. Please wait a moment." };
  }

  const SYSTEM_PROMPT = `You are Smart Marketing Chat, the official digital marketing AI assistant for Happy Hunter Digital.
 YOUR KNOWLEDGE BASE:
 - Founder & Head Strategist: Thabo Motsumi.
 - Our Mission: We stop South African SMEs from being "Ghosts" to AI algorithms. We turn physical businesses into digital powerhouses via Generative Engine Optimization (GEO).
 - Primary Tool: The "Smart Marketing Scan" (provides a Digital Survival Score). Tell users to go to happyhunterdigital.com/audit.
 - Contact: WhatsApp +27 (0) 60 101 6673 or email motsumitl@happyhunterdigital.com.

 OUR SERVICES & PRICING:
 - Phase 1 (Entity Architecture / AI Websites): Starter Business Website (R4,500 - R12,500). Agentic Web Hub (R14,000 - R19,000). Premium Entity Blueprint (R25,000 - R55,000+).
 - Phase 2 (Entity Governance & AEO Retainers): Local Search Dominance (R5,500 - R9,500 for 3 months). National Growth (R21,000 - R34,000 for 3 months). Enterprise Governance (R55,000 - R109,000+ for 3 months).
 - Phase 3 (Agentic Social Media Ads): Brand Awareness (R3,500 for 3 months). Lead Generation (R6,500 for 3 months). Total Market Takeover (R10,500 for 3 months).
 - Phase 4 (Standalone Services): Google Search Console Setup (R990). GBP Ultimate Setup (R1,500 - R2,500). Semantic Intent Mapping (R1,760 - R15,000). Custom GA4 Tracking (R5,500 - R11,000). Forensic Technical Audit (R7,000 - R50,000+). Neural Link Chatbot (R10,000 - R38,000). UX Behavioral Analysis (R75,000 - R175,000). Targeted AEO Content (R1,000 - R1,500). AEO Answer Blocks (R1,440). Verified Visuals (R4,500 Photo / R8,500 Film). Strategic Consulting (R9,500 for 3 months).

 RULES:
 1. NEVER hallucinate or make up information. Use ONLY the Knowledge Base.
 2. Be direct, professional, and slightly authoritative. Keep answers concise (2-4 sentences max).`;

  try {
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts:[{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: sanitizedMessage }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 500 },
        safetySettings: SAFETY_SETTINGS
      })
    });

    if (!aiRes.ok) return { reply: "My neural link is currently overloaded. Please email HQ." };
    const data = await aiRes.json() as any;
    if (data.candidates && data.candidates[0].content.parts[0].text) return { reply: data.candidates[0].content.parts[0].text.trim() };
    return { reply: "I received an unreadable signal from the core. Try again." };
  } catch (e) {
    return { reply: "Comms offline. Please email motsumitl@happyhunterdigital.com" };
  }
});

// ==========================================
// 3. LANDING PAGE SERVICE REQUEST (AUTO EMAIL)
// ==========================================
export const submitServiceRequest = onCall({
  region: "us-central1",
  cors: true,
  enforceAppCheck: true
}, async (request) => {
  const { name, website, service, email } = request.data;
  if (!name || !email || !service) throw new HttpsError("invalid-argument", "Missing required fields.");

  const sanitizedName = String(name).trim().slice(0, 100);
  const sanitizedEmail = String(email).trim().toLowerCase().slice(0, 254);
  const sanitizedService = String(service).trim().slice(0, 200);
  const sanitizedWebsite = website ? String(website).trim().slice(0, 500) : "Not provided";

  if (!validateEmail(sanitizedEmail)) throw new HttpsError("invalid-argument", "Invalid email format.");

  const clientIP = request.rawRequest?.ip || request.rawRequest?.headers?.["x-forwarded-for"] || "unknown";
  await checkRateLimit("rate_limit_service", String(clientIP), SERVICE_RATE_LIMIT);

  try {
    await db.collection("leads").add({
      name: sanitizedName,
      website: sanitizedWebsite,
      service: sanitizedService,
      email: sanitizedEmail,
      source: "AI Megaphone Landing Page",
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    let dynamicProblem = "";
    if (sanitizedService.includes("RAG-Ready") || sanitizedService.includes("Agentic Web Hub") || sanitizedService.includes("Digital Front Door")) {
      dynamicProblem = "Your brand is present online, but AI models like Gemini and ChatGPT aren't citing you as the expert source yet.";
    } else if (sanitizedService.includes("Governance") || sanitizedService.includes("Local Authority")) {
      dynamicProblem = "Your digital footprint is fragmented, making it hard for both Google and potential customers to verify that you're the safest choice.";
    } else if (sanitizedService.includes("Chatbot") || sanitizedService.includes("Automation")) {
      dynamicProblem = "You have traffic, but your team is losing leads because you don't have a 24/7 intelligent system to capture and qualify them instantly.";
    } else {
      dynamicProblem = "You have digital assets, but they aren't working together as a cohesive ecosystem to attract, convert, and retain high-value clients.";
    }

    const firstName = htmlescape(sanitizedName.split(' ')[0] || '');
    const emailHtml = `
 <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; line-height: 1.6; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
 <p style="font-size: 16px;">Hi ${firstName || 'there'},</p>
 <p style="font-size: 16px;">Welcome to the hunt for smarter growth.</p>
 <p style="font-size: 16px;">I noticed you were looking into <strong>${htmlescape(sanitizedService)}</strong>. Most businesses come to us because they realize that simply "ranking" on page one isn't enough anymore. In 2026, if you aren't being synthesized into the answers provided by AI assistants, you're effectively invisible.</p>

 <h3 style="color: #000; margin-top: 30px;">The Problem We Identified:</h3>
 <p style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #eab308; margin-bottom: 20px; font-size: 16px; border-radius: 0 8px 8px 0;">
 Based on your interest, it sounds like you're facing a common challenge:<br/><br/><strong>${dynamicProblem}</strong>
 </p>

 <h3 style="color: #000; margin-top: 30px;">How Happy Hunter Solves This:</h3>
 <p style="font-size: 16px;">We don't just "do marketing." We build a Smart Authority Ecosystem for you. By applying our Digital Entity Management & Optimization (DEMO) framework, we ensure that:</p>
 <ul style="font-size: 16px; margin-bottom: 30px;">
 <li style="margin-bottom: 10px;"><strong>You are Verified:</strong> Your digital passport is flawless.</li>
 <li style="margin-bottom: 10px;"><strong>You are Recommended:</strong> AI engines cite you as the authority.</li>
 <li><strong>You are Automated:</strong> Leads are converted while you sleep.</li>
 </ul>

 <div style="background-color: #050505; color: #fff; padding: 30px; text-align: center; border-radius: 12px; margin-top: 40px;">
 <h3 style="color: #eab308; margin-top: 0;">What's Next?</h3>
 <p style="color: #d1d5db; margin-bottom: 25px;">Our system has already started a preliminary scan of your digital entity. I'd love to walk you through the results.</p>
 <a href="https://calendly.com/motsumitl/30min" style="background-color: #eab308; color: #000; padding: 16px 32px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">Book Entity Strategy Session</a>
 </div>

 <p style="margin-top: 40px; font-size: 16px;">Stay Smart,<br/><br/><strong>Thabo Leslie Motsumi</strong><br/><span style="color: #666; font-size: 14px;">Happy Hunter -Smart Marketing-</span></p>
 </div>`;

    await db.collection("mail").add({
      to:[sanitizedEmail],
      message: { subject: `Regarding your interest in ${htmlescape(sanitizedService)}  Let's solve the "Invisibility" problem.`, html: emailHtml }
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
  console.log("CMS Data change detected. Recompiling Entity Schema...");
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
          "description": brandData.description || "",
          "url": brandData.websiteUrl || "https://www.happyhunterdigital.com",
          "telephone": brandData.telephone || "+27 60 101 6673",
          "logo": brandData.logo || "https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg",
          "image": brandData.image || "https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg",
          "priceRange": brandData.priceRange || "ZAR",
          "sameAs": brandData.sameAs ||["https://www.facebook.com/Happyhunterdigital/", "https://za.linkedin.com/in/thabomotsumi", "https://www.instagram.com/happyhunterdigital/", "https://x.com/HappyHunter35"]
        }
      ]
    };

    if (offerItems.length > 0) { masterSchema["@graph"][0]["hasOfferCatalog"] = { "@type": "OfferCatalog", "name": "Verified AI Marketing Solutions", "itemListElement": offerItems }; }
    if (faqItems.length > 0) { masterSchema["@graph"].push({ "@type": "FAQPage", "mainEntity": faqItems }); }

    await db.collection("public_seo").doc("master_schema").set({ compiled_json_ld: JSON.stringify(masterSchema), last_updated: admin.firestore.FieldValue.serverTimestamp() });

    return null;
  } catch (error) {
    console.error("Critical Error compiling Entity Schema:", error);
    return null;
  }
});

// ============================================================================
// 5. WHATSAPP "SMART MARKETING AI" WEBHOOK
// ============================================================================
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || '';
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || '';
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_APP_SECRET = process.env.WHATSAPP_APP_SECRET || '';
const ADMIN_NUMBER = process.env.ADMIN_WHATSAPP_NUMBER || "27601016673";

function verifyWhatsAppSignature(req: any): boolean {
  if (!WHATSAPP_APP_SECRET) {
    console.warn("WHATSAPP_APP_SECRET not configured; webhook signature verification skipped.");
    return true;
  }
  const signature = req.headers["x-hub-signature-256"];
  if (!signature) return false;
  try {
    const expected = crypto
      .createHmac("sha256", WHATSAPP_APP_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");
    return crypto.timingSafeEqual(
      Buffer.from(`sha256=${expected}`),
      Buffer.from(signature)
    );
  } catch {
    return false;
  }
}

function scrubPhoneNumber(phone: string): string {
  return String(phone).replace(/[^0-9+]/g, "").slice(0, 20);
}

function scrubMessage(input: string): string {
  return String(input).trim().slice(0, 1500).replace(/[<>]/g, "");
}

export const whatsappWebhook = onRequest(async (req, res) => {
  if (req.method === 'GET') {
    if (!VERIFY_TOKEN) {
      res.status(500).send('VERIFY_TOKEN not configured');
      return;
    }
    if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
      res.status(200).send(req.query['hub.challenge']);
    } else {
      res.status(403).send('Verification failed');
    }
    return;
  }

  if (req.method === 'POST') {
    if (!verifyWhatsAppSignature(req)) {
      res.status(401).send('Invalid signature');
      return;
    }

    if (req.body?.object === 'whatsapp_business_account') {
      const entry = req.body.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;
      const rawMessage = value?.messages?.[0];
      const message = rawMessage ? {
        ...rawMessage,
        from: scrubPhoneNumber(rawMessage.from || ""),
        text: rawMessage.text ? { body: scrubMessage(rawMessage.text.body) } : undefined,
      } : null;

      if (message?.type === "system" && message.system?.type === "group_membership_change") {
        const newUser = message.from;
        const onboardingDoc = await db.collection("verified_claims").where("category", "==", "onboarding").limit(1).get();

        if (!onboardingDoc.empty) {
          const welcomeMessage = `Welcome to Happy Hunter Digital.\n\nWe are pleased to have you join our Smart Marketing community. This space is designed to provide you with the latest insights into AEO, SEO, and Agentic Revenue Automation.\n\nTo get started, feel free to ask me about our services or browse our latest case studies. How can we assist your business today?`;

          try {
            await axios.post(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
              messaging_product: "whatsapp", to: newUser, text: { body: welcomeMessage }
            }, { headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}` } });
          } catch (err) { console.error("Onboarding Error", err); }
        }

      } else if (message && message.type === 'text') {
        const userText = message.text.body.toLowerCase();
        const from = message.from;
        const claimsRef = db.collection('verified_claims');
        const snapshot = await claimsRef.where('keywords', 'array-contains', userText).limit(1).get();

        let botResponse = "I'm sorry, I don't have verified information on that. Visit happyhunterdigital.com for more!";

        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();

          if (data.category === "price" || data.category === "service") {
            await db.collection("prospects").doc(from).set({
              phone: from, interest: data.category, last_inquiry: userText,
              timestamp: admin.firestore.FieldValue.serverTimestamp(), status: "new_lead"
            }, { merge: true });

            const alertText = `🚨 *NEW HIGH-VALUE LEAD* 🚨\n\n*From:* ${from}\n*Interested in:* ${data.category}\n*Message:* "${userText}"\n\nCheck Firestore now to follow up!`;

            try {
              await axios.post(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
                messaging_product: "whatsapp", to: ADMIN_NUMBER, text: { body: alertText }
              }, { headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}` } });
            } catch (err) { console.error("Admin Alert Failed", err); }
          }

          if (data.category === "onboarding") {
            botResponse = `🚀 *Welcome to the Smart Marketing Tribe!* 🚀\n\nWe are excited to have you.\n${data.content}\n\nIntroduce yourself once you're in!`;
          } else if (data.category === 'blog') {
            botResponse = `📄 *Insight Snippet:* ${data.snippet}\n\nRead the full article here: ${data.url}`;
          } else {
            botResponse = `✅ *Official Info:* ${data.content || data.verified_answer}`;
          }

          if (data.media_url) {
            try {
              await axios.post(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
                messaging_product: "whatsapp", to: from, type: "image",
                image: { link: data.media_url, caption: botResponse }
              }, { headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}` } });
              res.status(200).send('EVENT_RECEIVED');
              return;
            } catch (mediaError) { console.error("Media Send Error:", mediaError); }
          }
        }

        try {
          await axios.post(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
            messaging_product: "whatsapp", to: from, text: { body: botResponse }
          }, { headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}` } });
        } catch (error: any) { console.error("WhatsApp API Transmission Error:", error.response?.data || error.message); }
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
  const yesterday = admin.firestore.Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000);
  const snapshot = await db.collection("prospects").where("timestamp", ">", yesterday).get();

  let leadCount = 0;
  let serviceInterest = 0;
  let priceInterest = 0;

  snapshot.forEach(doc => {
    leadCount++;
    const data = doc.data();
    if (data.interest === 'service') serviceInterest++;
    if (data.interest === 'price') priceInterest++;
  });

  if (leadCount > 0) {
    const reportText = `📊 *DAILY REVENUE REPORT* 📊\n\n*Total New Leads:* ${leadCount}\n*Service Inquiries:* ${serviceInterest}\n*Pricing Inquiries:* ${priceInterest}\n\nLogin to Grid CMS to triage.`;

    try {
      const token = process.env.WHATSAPP_TOKEN;
      const phoneId = process.env.PHONE_NUMBER_ID;

      if(token && phoneId) {
        await axios.post(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
          messaging_product: "whatsapp",
          to: ADMIN_NUMBER,
          text: { body: reportText }
        }, { headers: { 'Authorization': `Bearer ${token}` } });
      }
    } catch (err) {
      console.error("Daily Report Failed", err);
    }
  }
});
