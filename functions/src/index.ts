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
// SYSTEM CONSTANTS & UTILITIES
// ============================================================================
const AI_MODEL = "gemini-3.1-flash-lite-preview";
const EMBEDDING_MODEL = "gemini-embedding-preview-0409";
const BASE_URL = "https://happyhunterdigital.com";

const SAFETY_SETTINGS = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
];

// EXPLICIT GLOBAL DECLARATIONS - DO NOT REMOVE
const WHATSAPP_TOKEN = process.env.META_SYSTEM_TOKEN || process.env.WHATSAPP_TOKEN || '';
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || '';
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'HAPPY_HUNTER_SECURE_2026';
const ADMIN_NUMBER = "27601016673";
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
          "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri,places.formattedAddress,places.nationalPhoneNumber,places.regularOpeningHours,places.photos,places.reviews,places.primaryTypeDisplayName,places.types"
        },
        body: JSON.stringify({ textQuery: query, pageSize: 3 })
      });
      return res.json() as Promise<any>;
    };

    let pData = await getPlaces(`${businessName} in ${location}`);
    let biz = pData?.places?.[0] || null;

    if (!biz) {
      pData = await getPlaces(businessName);
      biz = pData?.places?.[0] || null;
    }

    let competitor: any = null;
    if (biz?.primaryTypeDisplayName?.text) {
      const category = biz.primaryTypeDisplayName.text;
      const compData = await getPlaces(`best ${category} in ${location}`);
      if (compData.places && compData.places.length > 0) {
        competitor = compData.places.find((p: any) => p.displayName?.text?.toLowerCase() !== biz.displayName?.text?.toLowerCase());
      }
    }

    const websiteUrl: string | null = biz?.websiteUri || null;
    let detectedSchemas: string[] = [];
    let hasSchema = false;
    let websiteText = "None extracted";

    if (websiteUrl) {
      try {
        const webRes = await axios.get(websiteUrl, { timeout: 6000, headers: { "User-Agent": "Mozilla/5.0" } });
        const $ = cheerio.load(webRes.data);
        
        // Extract raw website body text for Semantic/Intent alignment checking
        $('script, style, nav, footer').remove();
        websiteText = $('body').text().replace(/\s+/g, ' ').substring(0, 3000);
        $('script[type="application/ld+json"]').each((_, element) => {
          hasSchema = true;
          try {
            const jsonData = JSON.parse($(element).html() || "{}");
            const extractType = (obj: any) => {
              if (!obj) return;
              if (Array.isArray(obj)) obj.forEach(extractType);
              else if (typeof obj === 'object') {
                if (obj['@type']) detectedSchemas.push(obj['@type']);
                if (obj['@graph']) extractType(obj['@graph']);
              }
            };
            extractType(jsonData);
          } catch (e) { /* silent */ }
        });
        detectedSchemas = [...new Set(detectedSchemas)];
        if (detectedSchemas.length === 0 && hasSchema) detectedSchemas = ["Valid Schema (Unknown Type)"];
      } catch (err) { console.log("Web scrape failed or timed out for:", websiteUrl); }
    }

    const schemaString = detectedSchemas.length > 0 ? `Detected JSON-LD Schemas: ${detectedSchemas.join(", ")}` : "No Schema Markup detected.";
    const bizNameStr = biz?.displayName?.text || "NONE FOUND";
    const bizTypes = biz?.types?.join(", ") || "None";
    const bizCategory = biz?.primaryTypeDisplayName?.text || "Generic";
    const photoCount = biz?.photos?.length || 0;
    const reviewCount = biz?.userRatingCount || 0;
    const rating = biz?.rating || 0;
    const address = biz?.formattedAddress || "None";
    const phone = biz?.nationalPhoneNumber || "None";
    const lastReview = biz?.reviews && biz.reviews.length > 0 ? biz.reviews[0].publishTime : "Never";

    const compName = competitor?.displayName?.text || "Unknown Competitor";
    const compRating = competitor?.rating || 0;
    const compReviews = competitor?.userRatingCount || 0;

    const context = `
--- TARGET ENTITY ---
Search Query: "${businessName} in ${location}"
Google Maps Name: "${bizNameStr}"
Category: ${bizCategory}
Other Types: ${bizTypes}
Rating: ${rating} (${reviewCount} reviews)
Last Review Date: ${lastReview}
Photos Count: ${photoCount}
Address: ${address}
Phone: ${phone}
Website Scraped: ${websiteUrl || 'NONE'}
Schemas: ${schemaString}
Website Content Snip: ${websiteText}

--- COMPETITOR ---
Competitor Name: "${compName}"
Competitor Rating: ${compRating} (${compReviews} reviews)
    `;

    const RUBRIC = `You are a strict Diagnostic Logic Engine analyzing a business's digital footprint. Use words like 'Diagnosis' and 'DNA Mutation' as *metaphors* for data inconsistencies. Do NOT sound like a literal medical doctor; refer to 'the business' or 'the entity', never 'the patient'. Pass the Data Context through these 5 If/Then Gates. Do NOT output markdown. Output ONLY a valid JSON object matching the required schema exactly.

Gate 1: Foundation (Ownership). If Google Maps Name is "NONE FOUND", Status = "NON-EXISTENT" (Urgency: "Your business is digitally invisible. You do not exist in the local economy."). If the profile appears unclaimed/unverified based on metadata, Status = "UNSECURED" (Urgency: "Your storefront is an open public park. You have no legal control over your entity."). Otherwise, assume "VERIFIED".
Gate 2: Ghost Effect (Categorization Gap). Perform a semantic intent Cross-Check: Compare the Maps [Category] and hidden [Other Types] against the [Website Content Snip] and [Schemas]. If there is a disconnect (e.g., GBP says 'Attorney' but site says 'LocalBusiness' or lacks legal semantics), Identity Crisis = "Mismatch". Problem: "Your DNA is mutated. Google categorizes you as [Category], but your site signals [Intent]."
Gate 3: Pulse (Social Proof). If "Last Review Date" is "Never" or >90 days, Review Velocity = "STALE". Urgency: "To a 2026 AI, a silent profile is a dead business." If Photos Count < 20, Media Depth = "VISUAL VOID". Urgency: "Profiles with 100+ photos get 5x clicks. You are a ghost in a visual world."
Gate 4: Micro-Fractures (NAP Integrity). Act as a String Similarity Algorithm (Levenshtein Distance). Cross-check the Maps [Address] & [Phone] against the [Website Content Snip]. If they do not appear exactly or similarity is < 95%, NAP Integrity = "FAILED". Urgency: "Micro-mismatches in your address/phone are fragmenting your authority. The algorithm cannot verify your 'Golden Thread'."
Gate 5: Authority Ownership (The Threat). If Competitor Rating/Reviews > Target, Threat = "Live Threat". Reality: "Authority Displacement: [Competitor Name] has infiltrated your territory and is capturing your local lead share."

Score (0-100%): Start at 100. Deduct heavily for failures (e.g. -40 NON-EXISTENT, -20 STALE, -15 VISUAL VOID, -15 NAP FAILED).

JSON SCHEMA:
{
  "score": number,
  "diagnosis": "string (the blunt, overarching forensic business summary)",
  "identityCrisis": { "status": "Aligned"|"Mismatch", "problem": "string", "whyItMatters": "string" },
  "gapAnalysis": [
    { "title": "Claim Status", "status": "VERIFIED"|"UNSECURED"|"NON-EXISTENT", "urgency": "string" },
    { "title": "Review Velocity", "status": "HEALTHY"|"STALE"|"REPUTATION RISK", "urgency": "string" },
    { "title": "Media Depth", "status": "HEALTHY"|"LOW"|"VISUAL VOID", "urgency": "string" },
    { "title": "NAP Integrity", "status": "VERIFIED"|"FAILED", "urgency": "string" }
  ],
  "competitorThreat": { "competitorName": "string", "threatLevel": "string", "reality": "string" },
  "recoveryRoadmap": { "recommendedAction": "string" }
}`;

    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Data Context: ${context}. \n\n ${RUBRIC}` }] }],
        safetySettings: SAFETY_SETTINGS,
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!aiRes.ok) throw new Error(`AI API Error: ${aiRes.status}`);
    const aiData = await aiRes.json() as any;
    const analysis = JSON.parse(aiData.candidates[0].content.parts[0].text);

    await db.collection("leads").add({
      businessName,
      email: clientEmail,
      whatsapp: whatsapp || null,
      score: analysis.score,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    const isGoodScore = analysis.score >= 80;
    const emailHtml = `
<div style="font-family: Arial, sans-serif; background-color: #050505; color: #fff; padding: 40px; border: 1px solid #333;">
  <div style="margin-bottom: 20px;">
    <span style="background-color: #ef4444; color: #fff; padding: 4px 8px; font-size: 10px; font-weight: bold; text-transform: uppercase;">SIGNAL MISMATCH DETECTED</span>
  </div>
  <h1 style="color: ${isGoodScore ? '#22c55e' : '#ef4444'}; margin-bottom: 5px;">Digital Survival Score: ${analysis.score}%</h1>
  <p style="font-size: 14px; color: #a1a1aa; margin-bottom: 30px;"><strong>Diagnosis:</strong> ${analysis.diagnosis}</p>
  
  <div style="background-color: #111827; border-left: 4px solid #f59e0b; padding: 20px; margin-bottom: 30px;">
    <h3 style="color: #f59e0b; margin-top: 0;">The Identity Crisis [${analysis.identityCrisis.status}]</h3>
    <p style="font-size: 14px; margin-bottom: 10px;"><strong>The Problem:</strong> ${analysis.identityCrisis.problem}</p>
    <p style="font-size: 14px;"><strong>Why it matters:</strong> ${analysis.identityCrisis.whyItMatters}</p>
  </div>

  <div style="background-color: #111827; border-left: 4px solid #ef4444; padding: 20px; margin-bottom: 30px;">
    <h3 style="color: #ef4444; margin-top: 0;">The Competitor Cannibalization Report</h3>
    <p style="font-size: 14px; margin-bottom: 10px;"><strong>Live Threat:</strong> ${analysis.competitorThreat.threatLevel}</p>
    <p style="font-size: 14px;"><strong>The Reality:</strong> ${analysis.competitorThreat.reality}</p>
    <p style="font-size: 14px; color: #ef4444; font-weight: bold; margin-top: 15px;">Every hour this remains unfixed, you are paying for their marketing.</p>
  </div>

  <div style="border-top: 1px solid #333; padding-top: 30px;">
    <h3 style="color: #eab308; margin-top: 0;">Stop The Revenue Leakage</h3>
    <p style="color: #d1d5db; margin-bottom: 25px; font-size: 14px;">${analysis.recoveryRoadmap.recommendedAction}</p>
    <a href="https://calendly.com/motsumitl/30min" style="background-color: #eab308; color: #000; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block; font-size: 14px;">BOOK 15-MINUTE ALIGNMENT CALL</a>
  </div>
</div>`;

    await db.collection("mail").add({
      to: [clientEmail],
      message: { subject: `[Diagnostic Report] CRITICAL VULNERABILITY: ${businessName}`, html: emailHtml }
    });

    return { success: true, ...analysis };

  } catch (e: any) {
    throw new HttpsError("internal", `Neural Handshake Interrupted. ${e.message}`);
  }
});


// ============================================================================
// 2. STRATEGIC CHAT (Web Chatbot)
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

  const lowerCaseMsg = message.toLowerCase();
  const isAskingForGBP = lowerCaseMsg.includes("gbp")
    || lowerCaseMsg.includes("google business profile presentation")
    || lowerCaseMsg.includes("iws presentation")
    || lowerCaseMsg.includes("iws slides")
    || lowerCaseMsg.includes("zero click")
    || lowerCaseMsg.includes("ai overview");
  const fileName = isAskingForGBP ? "hhd-gbp-zero-clicks.pdf" : "hhd-service-guide.pdf";
  const secureLink = `${BASE_URL}/assets/${fileName}`;

  const SYSTEM_PROMPT = `You are Smart Marketing Chat, the official digital marketing assistant for Happy Hunter Digital, powered by Gemini 3.1 Flash-Lite.

YOUR KNOWLEDGE BASE:
- Founder & Head Strategist: Thabo Motsumi. Contact: WhatsApp +27 (0) 60 101 6673 or email motsumitl@happyhunterdigital.com.
- Mission: We stop South African SMEs from being "Ghosts" to AI algorithms.
- Primary Tool: The "Smart Marketing Scan" (provides a Digital Survival Score).

NEW ASSET: "happyhunterdigital AI & Google Business Profile Zero Clicks Revolutions". This guide explains how businesses are losing visibility to Google's AI Overviews and how to fix it.

RULES:
1. SMART Q&A: Answer questions intelligently.
2. ALWAYS state the lowest price using the exact phrase: "starting from" when discussing services.
3. DO NOT use markdown asterisks. Use HTML tags (<strong>, <p>, <br>) for ALL formatting.
4. DOCUMENT ACCESS: If the user asks for a guide, document, presentation, or access code, DO NOT generate a real URL. You MUST include this EXACT placeholder word in your response instead: [SECURE_DOC_LINK]`;

  try {
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent?key=${G_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: message }] }],
        safetySettings: SAFETY_SETTINGS,
        generationConfig: { temperature: 0.1, maxOutputTokens: 500 }
      })
    });

    const data = await aiRes.json() as any;
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      let finalReply = data.candidates[0].content.parts[0].text.trim();
      finalReply = finalReply.replace(
        /\[SECURE_DOC_LINK\]/g,
        `<br/><br/><a href="${secureLink}" target="_blank" style="color: #eab308; text-decoration: underline;"><strong>[Tap Here to View Document]</strong></a>`
      );
      return { reply: finalReply };
    }
    return { reply: "I received an unreadable signal from the core. Try again." };
  } catch (e) {
    return { reply: "Comms offline. Please email motsumitl@happyhunterdigital.com" };
  }
});


// ============================================================================
// 3. LANDING PAGE SERVICE REQUEST (AUTO EMAIL)
// ============================================================================
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

    let dynamicProblem = "";
    if (service.includes("RAG-Ready") || service.includes("Agentic Web Hub") || service.includes("Digital Front Door")) {
      dynamicProblem = "Your brand is present online, but AI models like Gemini and ChatGPT aren't citing you as the expert source yet.";
    } else if (service.includes("Governance") || service.includes("Local Authority")) {
      dynamicProblem = "Your digital footprint is fragmented, making it hard for both Google and potential customers to verify that you're the safest choice.";
    } else if (service.includes("Chatbot") || service.includes("Automation")) {
      dynamicProblem = "You have traffic, but your team is losing leads because you don't have a 24/7 intelligent system to capture and qualify them instantly.";
    } else {
      dynamicProblem = "You have digital assets, but they aren't working together as a cohesive ecosystem to attract, convert, and retain high-value clients.";
    }

    const firstName = name.split(' ')[0] || 'there';
    const emailHtml = `
<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; line-height: 1.6; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
  <p style="font-size: 16px;">Hi ${firstName},</p>
  <p style="font-size: 16px;">Welcome to the hunt for smarter growth.</p>
  <p style="font-size: 16px;">I noticed you were looking into <strong>${service}</strong>. Most businesses come to us because they realize that simply "ranking" on page one isn't enough anymore. In 2026, if you aren't being synthesized into the answers provided by AI assistants, you're effectively invisible.</p>

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
    <a href="https://calendly.com/motsumitl/30min" style="background-color: #eab308; color: #000; padding: 16px 32px; text-decoration: none; font-weight: bold; border-radius: 12px; display: inline-block; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">Book a Free Discovery Call</a>
  </div>

  <p style="margin-top: 40px; font-size: 16px;">Stay Smart,<br/><br/><strong>Thabo Leslie Motsumi</strong><br/><span style="color: #666; font-size: 14px;">Happy Hunter -Smart Marketing-</span></p>
</div>`;

    await db.collection("mail").add({
      to: [email],
      message: {
        subject: `Regarding your interest in ${service} – Let's solve the "Invisibility" problem.`,
        html: emailHtml
      }
    });

    return { success: true };
  } catch (error: any) {
    throw new HttpsError("internal", `System Engine Failed. ${error.message}`);
  }
});


// ============================================================================
// BRAND SCHEMA COMPILER (Firestore Trigger)
// ============================================================================
export const compileEntitySchema = onDocumentWritten("brand_identity/{docId}", async () => {
  try {
    const brandSnapshot = await db.collection("brand_identity").limit(1).get();
    if (brandSnapshot.empty) return null;
    const brandData = brandSnapshot.docs[0].data();
    const masterSchema = {
      "@context": "https://schema.org",
      "@graph": [{
        "@type": brandData.orgType || "LocalBusiness",
        "name": brandData.legalName || "Happy Hunter Digital"
      }]
    };
    await db.collection("public_seo").doc("master_schema").set({
      compiled_json_ld: JSON.stringify(masterSchema),
      last_updated: admin.firestore.FieldValue.serverTimestamp()
    });
    return null;
  } catch (error) { return null; }
});


// ============================================================================
// 4. WHATSAPP WEBHOOK
// ============================================================================
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

      if (message?.type === "system" && message.system?.type === "group_membership_change") {
        const newUser = message.from;
        const onboardingDoc = await db.collection("verified_claims").where("category", "==", "onboarding").limit(1).get();

        if (!onboardingDoc.empty) {
          const welcomeMessage = `Welcome to Happy Hunter Digital.\n\nWe are pleased to have you join our Smart Marketing community. This space is designed to provide you with the latest insights into AEO, SEO, and Agentic Revenue Automation.\n\nTo get started, feel free to ask me about our services or browse our latest case studies. How can we assist your business today?`;
          try {
            await axios.post(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
              messaging_product: "whatsapp",
              to: newUser,
              text: { body: welcomeMessage }
            }, { headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}` } });
          } catch (err) { console.error("Onboarding Error", err); }
        }

      } else if (message && message.type === 'text') {
        const userText: string = message.text.body;
        const from: string = message.from;
        const G_KEY = process.env.GEMINI_API_KEY;

        let botResponse = "System updating. Please contact our strategist: https://wa.me/27601016673";
        let matchedData: any = null;

        const sessionRef = db.collection('whatsapp_sessions').doc(from);
        const sessionDoc = await sessionRef.get();
        let chatHistory: any[] = sessionDoc.exists ? sessionDoc.data()?.history || [] : [];

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
              const vectorQuery = await db.collection('verified_claims').findNearest(
                'embedding_vector',
                admin.firestore.FieldValue.vector(embedData.embedding.values),
                { limit: 1, distanceMeasure: 'COSINE' }
              ).get();
              if (!vectorQuery.empty) matchedData = vectorQuery.docs[0].data();
            }
          } catch (e) { console.error("Embedding Error", e); }
        }

        if (matchedData) {
          const data = matchedData;

          if (data.category === "price" || data.category === "service") {
            await db.collection("prospects").doc(from).set({
              phone: from,
              interest: data.category,
              last_inquiry: userText,
              timestamp: admin.firestore.FieldValue.serverTimestamp(),
              status: "new_lead"
            }, { merge: true });

            const alertText = `NEW HIGH-VALUE LEAD\n\nFROM: ${from}\nINTERESTED IN: ${data.category}\nMESSAGE: "${userText}"\n\nCheck Firestore now to follow up!`;
            try {
              await axios.post(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
                messaging_product: "whatsapp",
                to: ADMIN_NUMBER,
                text: { body: alertText }
              }, { headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}` } });
            } catch (err) { console.error("Admin Alert Failed", err); }
          }

          if (data.category === "onboarding") {
            botResponse = `WELCOME TO THE SMART MARKETING TRIBE!\n\nWe are excited to have you.\n${data.content}\n\nIntroduce yourself once you're in!`;
          } else if (data.category === 'blog') {
            botResponse = `INSIGHT SNIPPET:\n\n${data.snippet}\n\nRead the full article here: ${data.url}`;
          } else {
            botResponse = `OFFICIAL INFO:\n\n${data.content || data.verified_answer}`;
          }

          if (data.media_url) {
            try {
              await axios.post(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
                messaging_product: "whatsapp",
                to: from,
                type: "image",
                image: { link: data.media_url, caption: botResponse }
              }, { headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}` } });

              chatHistory.push({ role: "user", text: userText });
              chatHistory.push({ role: "model", text: botResponse });
              if (chatHistory.length > 10) chatHistory = chatHistory.slice(chatHistory.length - 10);
              await sessionRef.set({ history: chatHistory, last_updated: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });

              res.status(200).send('EVENT_RECEIVED');
              return;
            } catch (mediaError) { console.error("Media Send Error:", mediaError); }
          }

        } else if (G_KEY) {
          const WA_SYSTEM_PROMPT = `You are Smart Marketing Chat, the official digital marketing assistant for Happy Hunter Digital, powered by Gemini 3.1 Flash-Lite.

YOUR KNOWLEDGE BASE & IDENTITY:
- Founder & Head Strategist: Thabo Motsumi. Direct Link: https://wa.me/27601016673
- Mission: We stop South African SMEs from being "Ghosts" to AI algorithms.

YOUR CATALOG:
1. Entity Architecture (Agentic Websites).
2. Entity Governance (AEO Retainers).
3. Agentic Social Media Ads.
4. Intelligent WhatsApp Bots.
5. Standalone Smart Services (Google Setup, Audits, etc.)

RULES:
1. GREETINGS: If the user says "Hi" or asks what you do, reply with a welcoming message and a clean, numbered list of the 5 catalog items WITHOUT PRICES. Ask them to "Reply with a number to learn more."
2. PRICING: ONLY reveal prices if specifically asked. ALWAYS use the exact phrase "starting from".
3. FORMATTING: Do NOT use markdown asterisks. Use basic text formatting only.
4. DOCUMENT ACCESS: If the user asks for a guide, document, or presentation, DO NOT output a URL. Instead, you MUST include the exact tag [SEND_DOC_GBP] if they want the Google Business Profile guide, or [SEND_DOC_SERVICES] if they want the Service & Pricing guide.`;

          const formattedHistory = chatHistory.map((msg: any) => ({
            role: msg.role,
            parts: [{ text: msg.text }]
          }));
          formattedHistory.push({ role: "user", parts: [{ text: userText }] });

          try {
            const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent?key=${G_KEY}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                systemInstruction: { parts: [{ text: WA_SYSTEM_PROMPT }] },
                contents: formattedHistory,
                safetySettings: SAFETY_SETTINGS,
                generationConfig: { temperature: 0.2, maxOutputTokens: 300 }
              })
            });
            const data = await aiRes.json() as any;
            if (data.candidates && data.candidates[0].content.parts[0].text) {
              botResponse = data.candidates[0].content.parts[0].text.trim();
            }
          } catch (fallbackErr) { console.error("Generative Fallback Error:", fallbackErr); }
        }

        // ============================================================
        // WHATSAPP DOCUMENT INTERCEPTOR
        // ============================================================
        let sendGbpDoc = false;
        let sendServicesDoc = false;

        if (botResponse.includes("[SEND_DOC_GBP]")) {
          sendGbpDoc = true;
          botResponse = botResponse.replace("[SEND_DOC_GBP]", "").trim();
        }
        if (botResponse.includes("[SEND_DOC_SERVICES]")) {
          sendServicesDoc = true;
          botResponse = botResponse.replace("[SEND_DOC_SERVICES]", "").trim();
        }

        chatHistory.push({ role: "user", text: userText });
        chatHistory.push({ role: "model", text: botResponse || "Document prepared." });
        if (chatHistory.length > 10) chatHistory = chatHistory.slice(chatHistory.length - 10);
        await sessionRef.set({ history: chatHistory, last_updated: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });

        // Step 1: Send the AI conversational text response
        if (botResponse) {
          try {
            await axios.post(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
              messaging_product: "whatsapp",
              to: from,
              text: { body: botResponse }
            }, { headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}` } });
          } catch (sendError: any) { console.error("WhatsApp Text Error:", sendError.message); }
        }

        // Step 2: Send native WhatsApp CTA button with absolute document link
        if (sendGbpDoc || sendServicesDoc) {
          const docName = sendGbpDoc ? "AI & GBP Zero Clicks Revolutions Guide" : "Smart Marketing Service Guide";
          const fileName = sendGbpDoc ? "hhd-gbp-zero-clicks.pdf" : "hhd-service-guide.pdf";
          const viewerUrl = `${BASE_URL}/assets/${fileName}`;

          const interactivePayload = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: from,
            type: "interactive",
            interactive: {
              type: "cta_url",
              header: { type: "text", text: docName },
              body: { text: "Your PDF is ready. Tap below to view or download it directly." },
              footer: { text: "happyhunterdigital.com" },
              action: {
                name: "cta_url",
                parameters: { display_text: "View Document", url: viewerUrl }
              }
            }
          };

          try {
            await axios.post(
              `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
              interactivePayload,
              { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` } }
            );
          } catch (e: any) { console.error("CTA Send Error", e.message); }
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
// 5. DAILY REVENUE REPORT (Scheduled)
// ============================================================================
export const dailyRevenueReport = onSchedule("every day 08:00", async () => {
  const yesterday = admin.firestore.Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000);
  const snapshot = await db.collection("prospects").where("timestamp", ">", yesterday).get();
  if (snapshot.size > 0) {
    const reportText = `DAILY REVENUE REPORT\n\nTotal New Leads: ${snapshot.size}`;
    try {
      if (WHATSAPP_TOKEN && PHONE_NUMBER_ID) {
        await axios.post(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
          messaging_product: "whatsapp",
          to: ADMIN_NUMBER,
          text: { body: reportText }
        }, { headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}` } });
      }
    } catch (err) { console.error("Report Failed", err); }
  }
});


// ============================================================================
// 6. VECTOR EMBEDDER (Firestore Trigger)
// ============================================================================
export const vectorizeClaim = onDocumentWritten("verified_claims/{docId}", async (event) => {
  const doc = event.data?.after.data();
  if (!doc || !doc.content) return;
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
  } catch (error) { console.error("Vectorization Failed:", error); }
});
