import { onCall, HttpsError, onRequest } from "firebase-functions/v2/https";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import axios from "axios";
import * as cheerio from "cheerio";

admin.initializeApp();
const db = admin.firestore();

export const performAudit = onCall({
  region: "us-central1",
  cors: true,
  maxInstances: 10,
  timeoutSeconds: 300,
  secrets: ["DEEPSEEK_API_KEY", "PLACES_API_KEY"]
}, async (request) => {
  const { businessName, location, clientEmail, whatsapp } = request.data;
  const DS_KEY = process.env.DEEPSEEK_API_KEY;
  const P_KEY = process.env.PLACES_API_KEY;

  if (!businessName || !location || !clientEmail) throw new HttpsError("invalid-argument", "Missing required fields.");
  if (!DS_KEY || !P_KEY) throw new HttpsError("failed-precondition", "AI Core Offline.");

  try {
    const getPlaces = async (query: string) => {
      const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Goog-Api-Key": P_KEY, "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri" },
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
          headers: { "User-Agent": "Mozilla/5.0" }
        });
        const $ = cheerio.load(webRes.data);
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
          } catch (e) { }
        });
        detectedSchemas = [...new Set(detectedSchemas)];
      } catch (err) { }
    }

    const schemaString = detectedSchemas.length > 0 ? `Schemas: ${detectedSchemas.join(", ")}` : "No Schema.";
    const context = !biz ? `GHOST: No Maps data for "${businessName}". ${schemaString}` : `Searched: "${businessName}", Maps: "${biz.displayName?.text}", Rating: ${biz.rating || 0}, Website: ${websiteUrl || 'NONE'}, ${schemaString}`;

    const rubric = `SCORING RUBRIC (0-100): Baseline 30. Verified Maps Entity (Names Match Exactly): +20. Rating >= 4.0: +15. Schema Markup Detected (true): +25. Ghost Entity OR No Schema: Deduct 30. If hijacked, set their total score to 0. Format JSON ONLY: {"score": number, "summary": "string", "truths": ["string", "string", "string"]}`;

    const dsRes = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${DS_KEY}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are Hunter AI. Respond strictly with valid JSON." },
          { role: "user", content: `Audit: ${businessName}. Context: ${context}. ${rubric}` }
        ],
        response_format: { type: "json_object" }
      })
    });

    const dsData = await dsRes.json() as any;
    if (!dsRes.ok) throw new Error(dsData?.error?.message || `DeepSeek error ${dsRes.status}`);
    const rawText = dsData?.choices?.[0]?.message?.content;
    if (!rawText) throw new Error("DeepSeek empty");
    const analysis = JSON.parse(rawText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim());

    await db.collection("leads").add({ businessName, email: clientEmail, whatsapp: whatsapp || null, score: analysis.score, timestamp: admin.firestore.FieldValue.serverTimestamp() });
    const emailHtml = `<div style="font-family: Arial; background-color: #050505; color: #fff; padding: 40px; text-align: center;"><h1 style="color: ${analysis.score >= 70 ? '#22c55e' : '#eab308'};">Score: ${analysis.score}/100</h1><p>${analysis.summary}</p></div>`;
    await db.collection("mail").add({ to: [clientEmail], message: { subject: `Report: ${businessName}`, html: emailHtml } });

    return { success: true, ...analysis, telemetry: { mapsStatus: !biz ? "GHOST" : "VERIFIED", website: websiteUrl || "None", schema: hasSchema, schemasDetected: detectedSchemas } };
  } catch (e: any) {
    throw new HttpsError("internal", `Audit Failed. ${e.message}`);
  }
});

export const hunterChat = onCall({
  region: "us-central1",
  cors: true,
  secrets: ["DEEPSEEK_API_KEY"]
}, async (request) => {
  const { message } = request.data;
  const DS_KEY = process.env.DEEPSEEK_API_KEY;
  if (!message || !DS_KEY) return { reply: "Offline." };

  const SYSTEM_PROMPT = `You are Smart Marketing Chat for Happy Hunter Digital. Head Strategist: Thabo Motsumi. GEO Audit link: happyhunterdigital.com/audit. WhatsApp +27 60 101 6673. Keep answers under 3 sentences.`;

  try {
    const dsRes = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${DS_KEY}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: message }],
        temperature: 0.1,
        max_tokens: 500
      })
    });
    const data = await dsRes.json() as any;
    return { reply: data.choices?.[0]?.message?.content?.trim() || "Unreadable signal." };
  } catch (e) {
    return { reply: "Offline. Email motsumitl@happyhunterdigital.com" };
  }
});

export const submitServiceRequest = onCall({
  region: "us-central1",
  cors: true,
}, async (request) => {
  const { name, website, service, email } = request.data;
  if (!name || !email || !service) throw new HttpsError("invalid-argument", "Missing fields.");
  try {
    await db.collection("leads").add({ name, website: website || "None", service, email, source: "Landing Page", timestamp: admin.firestore.FieldValue.serverTimestamp() });
    const emailHtml = `<p>Hi ${name.split(' ')[0]}, thanks for your interest in ${service}. We will review your site shortly.</p>`;
    await db.collection("mail").add({ to: [email], message: { subject: `Regarding ${service}`, html: emailHtml } });
    return { success: true };
  } catch (e: any) {
    throw new HttpsError("internal", e.message);
  }
});

export const compileEntitySchema = onDocumentWritten("brand_identity/{docId}", async (event) => {
  try {
    const snap = await db.collection("brand_identity").limit(1).get();
    if (snap.empty) return null;
    const data = snap.docs[0].data();
    const master = { "@context": "https://schema.org", "@type": data.orgType || "LocalBusiness", "name": data.legalName || "Happy Hunter Digital", "url": data.websiteUrl || "https://www.happyhunterdigital.com" };
    await db.collection("public_seo").doc("master_schema").set({ compiled_json_ld: JSON.stringify(master), last_updated: admin.firestore.FieldValue.serverTimestamp() });
    return null;
  } catch (e) {
    return null;
  }
});

export const whatsappWebhook = onRequest(async (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'HAPPY_HUNTER_SECURE_2026';
  if (req.method === 'GET') {
    if (req.query['hub.verify_token'] === VERIFY_TOKEN) res.status(200).send(req.query['hub.challenge']);
    else res.status(403).send('Failed');
    return;
  }
  res.status(200).send('EVENT_RECEIVED');
});

export const dailyRevenueReport = onSchedule("every day 08:00", async (event) => {
  console.log("Daily report triggered.");
});
