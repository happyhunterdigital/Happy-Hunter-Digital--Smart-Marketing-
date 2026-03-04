import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import axios from "axios";
import * as cheerio from "cheerio";

admin.initializeApp();
const db = getFirestore();

// ============================================================================
// 1. SMART MARKETING AUDIT (UPGRADED: AI-DRIVEN HIJACK DETECTION)
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
        // --- 1. PROGRESSIVE GOOGLE PLACES SEARCH ---
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
        let biz = pData.places && pData.places.length > 0 ? pData.places[0] : null;

        // Broad fallback search if strict location fails
        if (!biz) {
            pData = await getPlaces(businessName);
            biz = pData.places && pData.places.length > 0 ? pData.places[0] : null;
        }

        // We DO NOT guess the URL anymore. If Google doesn't know it, it's a Ghost.
        const websiteUrl = biz?.websiteUri || null;
        
        // --- 2. DEEP WEBSITE & SCHEMA SCRAPING ---
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

        // --- 3. CONTEXT INJECTION FOR AI ---
        const schemaString = detectedSchemas.length > 0 ? `Detected JSON-LD Schemas: ${detectedSchemas.join(", ")}` : "No Schema Markup detected.";
        const bizNameStr = biz?.displayName?.text || "NONE FOUND";
        
        let context = "";
        if (!biz) {
            context = `GHOST ENTITY: No Google Maps data found for "${businessName}". No Website verified. ${schemaString}`;
        } else {
            // We pass both names to the AI so it can detect the Traffic Hijack autonomously
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
        - Schema Markup Detected (true): +25 points.
        - Ghost Entity OR No Schema: Deduct 30 points.
        
        CRITICAL TRAFFIC HIJACK INSTRUCTION:
        If the "User Searched For" name and the "Google Maps Returned" name are fundamentally different businesses (e.g. "IntegratedWellth" vs "Integrated Health"), you MUST treat this as a TRAFFIC HIJACK. 
        If hijacked, set their total score to 0. Do NOT praise the competitor's rating. In your summary, explicitly state that because their digital footprint is weak, Google algorithms are routing their high-intent customers directly to a competitor named "[Google Maps Returned name]". Agitate this pain point.
        
        INSTRUCTIONS FOR 'truths' ARRAY (Must be exactly 3 items):
        Truth 1: State if they are Verified, a Ghost, or if a Traffic Hijack occurred (name the competitor).
        Truth 2: Mention their Website status (If NO website is linked, state it is a critical algorithmic failure).
        Truth 3: Explicitly list the AI Schema Markup (JSON-LD) types found (${detectedSchemas.join(", ")}) or state it is completely missing.
        `;

        const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${G_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts:[{ text: `You are Hunter AI. Audit: ${businessName}. Data Context: ${context}. ${RUBRIC} Format JSON: { "score": number, "summary": "string", "truths": ["string", "string", "string"] }` }] }],
                generationConfig: { responseMimeType: "application/json" }
            })
        });

        const aiData = await aiRes.json() as any;
        const analysis = JSON.parse(aiData.candidates[0].content.parts[0].text);

        // Determine if Gemini classified it as a Hijack based on a 0 score despite finding a Maps Node
        const isHijacked = (biz && analysis.score === 0);

        const telemetry = {
            mapsStatus: !biz ? "GHOST (NOT FOUND)" : isHijacked ? "HIJACKED (COMPETITOR FOUND)" : "VERIFIED",
            website: websiteUrl || "None Linked",
            schema: hasSchema,
            schemasDetected: detectedSchemas
        };

        await db.collection("leads").add({ businessName, email: clientEmail, score: analysis.score, timestamp: admin.firestore.FieldValue.serverTimestamp() });

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
        return { reply: "Connection offline. Missing parameters." };
    }

    const SYSTEM_PROMPT = `You are Hunter AI, the official digital marketing assistant for Happy Hunter Digital (also known as Happy Hunter Systems).
    YOUR KNOWLEDGE BASE:
    - Founder & Head Strategist: Thabo Leslie Motsumi.
    - Our Mission: We stop South African SMEs from being "Ghosts" to AI algorithms. We turn physical businesses into digital powerhouses.
    - Our Services: 1) Trust Synchronization (Google Maps, NAP consistency). 2) AI Visibility (AEO, Schema markup for ChatGPT/Gemini). 3) Agentic Revenue (Automated lead capture).
    - Our Tool: The "Smart Marketing Scan" (provides a Digital Survival Score).
    - Contact: WhatsApp +27 (0) 60 101 6673 or email motsumitl@happyhunterdigital.com. Website: www.happyhunterdigital.com
    - Upcoming Event: We are speaking at the Integrated Wellth Summit on 28 Feb in Waterfall City.
    RULES:
    1. NEVER make up information. Use ONLY the Knowledge Base.
    2. Be direct, professional, and slightly authoritative. Keep answers to 2-3 sentences max.`;

    try {
        const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${G_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                systemInstruction: { parts:[{ text: SYSTEM_PROMPT }] },
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
// 3. LANDING PAGE SERVICE REQUEST
// ==========================================
export const submitServiceRequest = onCall({
    region: "us-central1",
    cors: true,
}, async (request) => {
    const { name, website, service, email } = request.data;
    if (!name || !email || !service) throw new HttpsError("invalid-argument", "Missing required fields.");
    try {
        await db.collection("leads").add({ name, website: website || "Not provided", service, email, source: "AI Megaphone Landing Page", timestamp: admin.firestore.FieldValue.serverTimestamp() });
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

        const masterSchema: any = {
            "@context": "https://schema.org",
            "@graph":[
                {
                    "@type": brandData.orgType || "Organization",
                    "@id": `${brandData.websiteUrl || "https://happyhunterdigital.com"}#organization`,
                    "name": brandData.legalName,
                    "description": brandData.description,
                    "sameAs": brandData.sameAs || []
                }
            ]
        };

        if (faqItems.length > 0) { masterSchema["@graph"].push({ "@type": "FAQPage", "mainEntity": faqItems }); }
        await db.collection("public_seo").doc("master_schema").set({ compiled_json_ld: JSON.stringify(masterSchema), last_updated: admin.firestore.FieldValue.serverTimestamp() });
        return null;
    } catch (error) {
        console.error("Critical Error compiling Entity Schema:", error);
        return null;
    }
});
