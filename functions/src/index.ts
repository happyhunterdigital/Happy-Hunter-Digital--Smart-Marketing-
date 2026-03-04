import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

admin.initializeApp();
const db = getFirestore();

// ============================================================================
// 1. SMART MARKETING AUDIT (FROM V3 - 100% UNTOUCHED LOGIC)
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
// 2. STRATEGIC CHAT (FROM V3 - UPGRADED: INCREASED TOKENS + BETTER PROMPTING)
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
    2. If someone asks who the founder is, say "Thabo Leslie Motsumi".
    3. Be direct, professional, and slightly authoritative (Military-grade precision).
    4. COMPLETE YOUR SENTENCES. Do not trail off.
    5. Keep answers to 2-3 sentences max.`;

    try {
        const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${G_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{ text: SYSTEM_PROMPT }]
                },
                contents: [
                    { role: "user", parts: [{ text: message }] }
                ],
                generationConfig: { temperature: 0.1, maxOutputTokens: 500 }
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

// ==========================================
// 3. LANDING PAGE SERVICE REQUEST & EMAIL ROUTER (New Additions Kept Intact)
// ==========================================
export const submitServiceRequest = onCall({
    region: "us-central1",
    cors: true,
}, async (request) => {
    const { name, website, service, email } = request.data;

    if (!name || !email || !service) {
        throw new HttpsError("invalid-argument", "Missing required fields.");
    }

    try {
        await db.collection("leads").add({
            name,
            website: website || "Not provided",
            service,
            email,
            source: "AI Megaphone Landing Page - Service Request",
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        let dynamicProblem = "";
        if (service.includes("RAG-Ready")) {
            dynamicProblem = "Your brand is present online, but AI models like Gemini and ChatGPT aren't citing you as the expert source yet.";
        } else if (service.includes("Digital Passport")) {
            dynamicProblem = "Your digital footprint is fragmented, making it hard for both Google and potential customers to verify that you're the safest choice.";
        } else if (service.includes("Agentic Revenue")) {
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
                Based on your interest, it sounds like you're facing a common challenge: <br/><br/><strong>${dynamicProblem}</strong>
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
        </div>
        `;

        await db.collection("mail").add({
            to: [email],
            message: {
                subject: `Regarding your interest in ${service} – Let's solve the "Invisibility" problem.`,
                html: emailHtml
            }
        });

        return { success: true };
    } catch (error: any) {
        throw new HttpsError("internal", `System Engine Failed to Compile Data. ${error.message}`);
    }
});

// ==========================================
// 4. ENTITY ORCHESTRATION ENGINE (JSON-LD)
// ==========================================
export const compileEntitySchema = onDocumentWritten("brand_identity/{docId}", async (event) => {
    console.log("CMS Data change detected. Recompiling Entity Schema...");
    try {
        const brandSnapshot = await db.collection("brand_identity").limit(1).get();
        if (brandSnapshot.empty) {
            console.log("No brand identity found. Aborting compilation.");
            return null;
        }
        
        const brandData = brandSnapshot.docs[0].data();
        const aeoSnapshot = await db.collection("aeo_knowledge").where("speakable", "==", true).get();
        
        const faqItems = aeoSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                "@type": "Question",
                "name": data.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": data.answer
                }
            };
        });

        const masterSchema: any = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": brandData.orgType || "Organization",
                    "@id": `${brandData.websiteUrl || "https://happyhunterdigital.com"}#organization`,
                    "name": brandData.legalName,
                    "description": brandData.description,
                    "foundingDate": brandData.foundingDate ? brandData.foundingDate.toDate().toISOString().split('T')[0] : undefined,
                    "sameAs": brandData.sameAs || []
                }
            ]
        };

        if (faqItems.length > 0) {
            masterSchema["@graph"].push({
                "@type": "FAQPage",
                "mainEntity": faqItems
            });
        }

        await db.collection("public_seo").doc("master_schema").set({
            compiled_json_ld: JSON.stringify(masterSchema),
            last_updated: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log("Successfully compiled and deployed Master Entity Schema.");
        return null;

    } catch (error) {
        console.error("Critical Error compiling Entity Schema:", error);
        return null;
    }
});
