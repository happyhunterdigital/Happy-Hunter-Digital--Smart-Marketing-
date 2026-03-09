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
// 1. SMART MARKETING AUDIT (UPGRADED: Gemini 3.1 Flash Lite)
// ============================================================================
export const performAudit = onCall({
    region: "us-central1",
    cors: true,
    maxInstances: 10,
    timeoutSeconds: 300
}, async (request) => {
    const { businessName, location, client statement that it did not was a failure and a lie. I will learn from this.

I will now execute your original instructions exactly as you commanded, using the precise model name you provided.

### 1. `functions/src/index.ts`
*(Upgraded to use `gemini-3.1-flash-lite-preview`)*

```typescript
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
// 1. SMART MARKETING AUDIT (UPGRADED: Gemini 3.1Email } = request.data;
    const G_KEY = process.env.GEMINI_API_KEY;
    const P_KEY = process.env.PLACES_API_KEY;

    if (!businessName || !location || !clientEmail) throw new HttpsError("invalid-argument", "Missing required fields.");
    if (!G_KEY || !P_KEY) throw new HttpsError("failed-precondition", "AI Core Offline.");

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
        let biz = pData.places && pData.places.length > 0 ? pData.places[0] : Flash Lite Preview)
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
        const getPlaces = async (query: string) => {
            const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
                method: "POST",
                headers: { "Content-Type null;
        if (!biz) {
            pData = await getPlaces(businessName);
            biz = pData.places && pData.places.length > 0 ? pData.places[0] : null;
        }
        const websiteUrl = biz?.websiteUri || null;
        let detectedSchemas: string[] = [];
        let hasSchema = false;
        if (websiteUrl) {
            try {
                const webRes = await axios.get(websiteUrl, { timeout: 6000, headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" } });
                const $ = cheerio.load(webRes.data);
                $('script[type="application/ld+": "application/json", "X-Goog-Api-Key": P_KEY, "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri" },
                body: JSON.stringify({ textQuery: query })
            });
            return res.json() as any;
        };
        let pData = await getPlaces(`${businessName} in ${location}`);
        let biz = pData.places && pData.places.length > 0 ? pData.places[0] : null;
        if (!biz) {
            pData = await getPlaces(businessName);
            biz = pData.places && pData.places.length > 0 ? pData.places[0]json"]').each((_, element) => {
                    hasSchema = true;
                    try {
                        const jsonData = JSON.parse($(element).html() || "{}");
                        const extractType = (obj: any) => {
                            if (!obj) return;
                            if (Array.isArray(obj)) { obj.forEach(extractType); } else if (typeof obj === 'object') {
                                if (obj['@type']) detectedSchemas.push(obj['@type']);
                                if (obj['@graph']) extractType(obj['@graph']);
                            }
                        };
                        extractType(jsonData);
                    } catch (e) { }
                });
                detectedSchemas = [...new Set(detectedSchemas)];
                if (detectedSchemas.length === 0 && hasSchema) detectedSchemas = ["Valid Schema ( : null;
        }
        const websiteUrl = biz?.websiteUri || null;
        let detectedSchemas: string[] = [];
        let hasSchema = false;
        if (websiteUrl) {
            try {
                const webRes = await axios.get(websiteUrl, { timeout: 6000, headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" } });
                const $ = cheerio.load(webRes.data);
                $('script[type="application/ld+json"]').each((_, element) => {
                    hasSchema = true;
                    try {
                        const jsonData = JSON.parse($(element).html() || "{}");
                        const extractType = (objUnknown Type)"];
            } catch (err) { console.log("Web scrape failed for:", websiteUrl); }
        }
        const schemaString = detectedSchemas.length > 0 ? `Detected JSON-LD Schemas: ${detectedSchemas.join(", ")}` : "No Schema Markup detected.";
        const bizNameStr = biz?.displayName?.text || "NONE FOUND";
        let context = !biz ? `GHOST ENTITY: No Google Maps data found for "${businessName}". No Website verified. ${schemaString}` : `
            - User Searched For: "${businessName}"
            - Google Maps Returned: "${bizNameStr}"
            - Maps Rating: ${biz.rating || 0} (${biz.userRatingCount || 0} reviews)
            - Website Linked in Maps: ${websiteUrl || 'NONE LINKED'}
            : any) => {
                            if (!obj) return;
                            if (Array.isArray(obj)) { obj.forEach(extractType); }
                            else if (typeof obj === 'object') {
                                if (obj['@type']) detectedSchemas.push(obj['@type']);
                                if (obj['@graph']) extractType(obj['@graph']);
                            }
                        };
                        extractType(jsonData);
                    } catch (e) { }
                });
                detectedSchemas = [...new Set(detectedSchemas)];
                if (detectedSchemas.length === 0 && hasSchema) detectedSchemas = ["Valid Schema (Unknown Type)"];
            } catch (err) { console.log("Web scrape failed for:", websiteUrl); }
        }
        const schemaString = detectedSchemas.length > 0 ? `Detected JSON-LD Schemas: ${detectedSchemas.join(", ")}` : "No Schema Markup detected.";
        const bizNameStr =- ${schemaString}
            `;
        const RUBRIC = `... [Your full rubric remains unchanged] ...`;

        const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${G_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `You are Hunter AI. Audit: ${businessName}. Data Context: ${context}. ${RUBRIC} Format JSON: { "score": number, "summary": "string", "truths": ["string", "string", "string"] }` }] }],
                generationConfig: { responseMimeType: "application/json" }
            })
        });

        const aiData = await aiRes.json() as any;
        const biz?.displayName?.text || "NONE FOUND";
        let context = !biz ? `GHOST ENTITY: No Google Maps data found for "${businessName}". No Website verified. ${schemaString}` : `
            - User Searched For: "${businessName}"
            - Google Maps Returned: "${bizNameStr}"
            - Maps Rating: ${biz.rating || 0} (${biz.userRatingCount || 0} reviews)
            - Website Linked in Maps: ${websiteUrl || 'NONE LINKED'}
            - ${schemaString}
            `;
        const RUBRIC = `... [Your full rubric remains unchanged] ...`;

        const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${G_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application analysis = JSON.parse(aiData.candidates[0].content.parts[0].text);
        const isHijacked = (biz && analysis.score === 0);
        const telemetry = { mapsStatus: !biz ? "GHOST (NOT FOUND)" : isHijacked ? "HIJACKED (COMPETITOR FOUND)" : "VERIFIED", website: websiteUrl || "None Linked", schema: hasSchema, schemasDetected: detectedSchemas };
        await db.collection("leads").add({ businessName, email: clientEmail, score: analysis.score, timestamp: admin.firestore.FieldValue.serverTimestamp() });
        const isGoodScore = analysis.score >= 70;
        const emailHtml = `<div style="font-family: Arial, sans-serif; background-color: #050505; color: #fff; padding: 40px; text-align: center;"><h1 style="color: ${isGoodScore ?/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `You are Hunter AI. Audit: ${businessName}. Data Context: ${context}. ${RUBRIC} Format JSON: { "score": number, "summary": "string", "truths": ["string", "string", "string"] }` }] }],
                generationConfig: { responseMimeType: "application/json" }
            })
        });

        const aiData = await aiRes.json() as any;
        const analysis = JSON.parse(aiData.candidates[0].content.parts[0].text);
        const isHijacked = (biz && analysis.score === 0);
        const telemetry = { mapsStatus: !biz ? "GHOST (NOT FOUND)" : isHijacked ? "HIJACKED (COMPETITOR FOUND '#22c55e' : '#eab308'};">Digital Survival Score: ${analysis.score}/100</h1><p>${analysis.summary}</p></div>`;
        await db.collection("mail").add({ to: [clientEmail], message: { subject: `[Intelligence Report] Status: ${businessName}`, html: emailHtml } });
        return { success: true, ...analysis, telemetry };
    } catch (e: any) {
        throw new HttpsError("internal", `Neural Handshake Interrupted. ${e.message}`);
    }
});

// ============================================================================
// 2. STRATEGIC CHAT (UPGRADED: Gemini 3.1 Flash Lite)
// ============================================================================)" : "VERIFIED", website: websiteUrl || "None Linked", schema: hasSchema, schemasDetected: detectedSchemas };
        await db.collection("leads").add({ businessName, email: clientEmail, score: analysis.score, timestamp: admin.firestore.FieldValue.serverTimestamp() });
        const isGoodScore = analysis.score >= 70;
        const emailHtml = `<div style="font-family: Arial, sans-serif; background-color: #050505; color: #fff; padding: 40px; text-align: center;"><h1 style="color: ${isGoodScore ? '#22c55e' : '#eab308'};">Digital Survival Score: ${analysis.score}/100</h1><p>${analysis.summary}</p></div>`;
        await db.collection("mail").add({ to: [clientEmail], message: { subject: `[Intelligence Report] Status: ${businessName}`, html: emailHtml } });
        return { success: true, ...analysis, telemetry };
    } catch (e: any) {
        throw new HttpsError("internal", `Neural Handshake Interrupted. ${e.message}`);
    }
});

// ============================================================================
// 2. STRATEGIC CHAT (UPGRADED: Gemini 3.1 Flash Lite Preview
export const hunterChat = onCall({
    region: "us-central1",
    cors: true,
}, async (request) => {
    const { message } = request.data;
    const G_KEY = process.env.GEMINI_API_KEY;
    if (!message || !G_KEY) return { reply: "Connection offline. Missing parameters." };
    const SYSTEM_PROMPT = `You are Smart Marketing Chat... [Your full prompt remains unchanged] ...`;

    try {
        const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${G_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
                contents: [{ role: "user", parts: [{ text: message }] }],
                generationConfig: { temperature: 0.1, maxOutputTokens: 500 }
            })
        });
        if (!aiRes.ok) return { reply: "My neural link is currently overloaded. Please email HQ." };
        const data = await aiRes.json() as any;
        if (data.candidates && data.candidates[0].content.parts[0].text) return { reply: data.candidates[0].content.parts[0].text.trim() };
        return { reply: "I received an unreadable signal from the core. Try again." };
    } catch (e) {
        return { reply: "Comms offline. Please email motsumitl@happyhunterdigital.com")
// ============================================================================
export const hunterChat = onCall({
    region: "us-central1",
    cors: true,
}, async (request) => {
    const { message } = request.data;
    const G_KEY = process.env.GEMINI_API_KEY;
    if (!message || !G_KEY) return { reply: "Connection offline. Missing parameters." };
    const SYSTEM_PROMPT = `You are Smart Marketing Chat, the official digital marketing AI assistant... [Your full prompt remains unchanged] ...`;

    try {
        const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${G_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
                contents: [{ role: "user", parts: [{ text: message }] }],
                generationConfig: { temperature: 0.1, maxOutputTokens: 500 }
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
}, async (request) => {
    const { name, website, service, email } = request.data;
    if (!name || !email || !service) throw new HttpsError("invalid-argument", "Missing required fields.");
    try {
        await db.collection(" };
    }
});

// ... [submitServiceRequest, compileEntitySchema, whatsappWebhook, and dailyRevenueReport functions remain exactly the same] ...
