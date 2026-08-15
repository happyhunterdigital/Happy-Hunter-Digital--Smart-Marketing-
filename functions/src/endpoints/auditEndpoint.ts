import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import OpenAI from "openai";
import { scrapeWebsiteText, checkSecurityHeaders, getPerformanceSignals, checkLlmsTxt, SecuritySignals, PerformanceSignals } from "../services/auditService";
import { sendAdminAlert, sendAuditResultToClient } from "../services/whatsappService";
import { relayAuditToCrm } from "../services/crmRelay";
import { FieldValue } from "firebase-admin/firestore";
import { isGbpUrl, ALLOWED_ORIGINS, sanitizeInput, isValidEmail, isValidDomainOrUrl, detectGbpViaSearch, checkRateLimit, formatPerformanceEvidence, formatSecurityEvidence, formatSeoEvidence } from "../utils/auditHelpers";

export const performAudit = onCall({
  region: "us-central1",
  cors: ALLOWED_ORIGINS,
  enforceAppCheck: false,
  secrets: ["DEEPSEEK_API_KEY"],
  maxInstances: 10,
  timeoutSeconds: 300
}, async (request) => {
  const { businessName, city, websiteUrl, clientEmail, whatsapp } = request.data;
  const traceId = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

  const hasWebsite = typeof websiteUrl === "string" && websiteUrl.trim().length > 0;
  const gbpOnly = !hasWebsite || isGbpUrl(websiteUrl?.trim() ?? "");

  if (!businessName || !city || !clientEmail) throw new HttpsError("invalid-argument", "Missing required fields.");
  if (!isValidEmail(clientEmail)) throw new HttpsError("invalid-argument", "Invalid email format.");

  const callerIp = (request.rawRequest?.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || request.rawRequest?.ip || "unknown";
  const withinLimit = await checkRateLimit(`audit_${callerIp}`, 3, 525600);
  if (!withinLimit) throw new HttpsError("resource-exhausted", "You have exhausted your limit of 3 audits per computer.");

  const safeBizName = sanitizeInput(businessName, 100);
  const safeCity = sanitizeInput(city, 100);
  const safeEmail = clientEmail.trim().toLowerCase();
  const safeWebsiteUrl = hasWebsite ? websiteUrl.trim() : "";

  if (hasWebsite && !gbpOnly && !isValidDomainOrUrl(safeWebsiteUrl)) {
    throw new HttpsError("invalid-argument", "The website URL must be a valid domain.");
  }

  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) throw new Error("DEEPSEEK_API_KEY is missing from environment secrets.");

    const openai = new OpenAI({ baseURL: "https://api.deepseek.com", apiKey: apiKey });

    const runAiAudit = async (promptText: string) => {
      const response = await openai.chat.completions.create({
        model: "deepseek-v4-flash",
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: promptText }]
      });
      const content = response.choices[0].message.content;
      if (!content) throw new Error("Empty AI response received");
      return JSON.parse(content);
    };

    let analysis: { score: number; summary: string; truths: string[] };
    let telemetry: Record<string, any>;
    const gbpStatusPromise = detectGbpViaSearch(safeBizName, safeCity);

    if (gbpOnly) {
      const gbpUrl = safeWebsiteUrl || "(not provided)";
      const gbpStatus = await gbpStatusPromise;
      const context = `Business Name: ${safeBizName}\nLocation/City: ${safeCity}\nGBP: ${gbpStatus}\nURL: ${gbpUrl}\nWebsite: NONE`;

      const prompt = `You are Hunter AI. Analyze this business with NO standalone website.
<data>\n${context}\n</data>
Evaluate Pillar 6 (GBP) and compute the digital authority impact.
Format JSON ONLY: {"score": number, "summary": "string", "truths": ["string", "string", "string", "string", "string", "string", "string"]}`;

      analysis = await runAiAudit(prompt);

      telemetry = {
        mapsStatus: safeWebsiteUrl ? "GBP_URL_PROVIDED" : "NO_WEBSITE_NO_GBP",
        gbpOnly: true, gbpUrl: String(safeWebsiteUrl || ""), gbpStatus: String(gbpStatus), website: "",
      };

    } else {
      const [scrapedDataResult, gbpStatusResult, securityResult, performanceResult, llmsTxtResult] = await Promise.allSettled([
        scrapeWebsiteText(safeWebsiteUrl), gbpStatusPromise, checkSecurityHeaders(safeWebsiteUrl), getPerformanceSignals(safeWebsiteUrl), checkLlmsTxt(safeWebsiteUrl)
      ]);

      if (scrapedDataResult.status === "rejected") {
        throw new HttpsError("invalid-argument", `Website unreachable: ${scrapedDataResult.reason?.message}`);
      }

      const scrapedData = scrapedDataResult.value;
      const gbpStatusText = gbpStatusResult.status === "fulfilled" ? gbpStatusResult.value : "GBP check unavailable";
      const securityData = securityResult.status === "fulfilled" ? securityResult.value : { hasSSL: false, sslRedirect: false, headers: { strictTransportSecurity: false, xContentTypeOptions: false, xFrameOptions: false, contentSecurityPolicy: false }, securityScore: 0 } as SecuritySignals;
      const performanceData = performanceResult.status === "fulfilled" ? performanceResult.value : { performanceScore: -1, seoScore: -1, accessibilityScore: -1, bestPracticesScore: -1, coreWebVitals: { lcp: -1, cls: -1, inp: -1 }, mobileUsability: "UNAVAILABLE" } as PerformanceSignals;
      scrapedData.hasLlmsTxt = llmsTxtResult.status === "fulfilled" ? llmsTxtResult.value : false;

      const context = `Business Name: ${safeBizName}\nLocation/City: ${safeCity}\nWebsite URL: ${safeWebsiteUrl}\n
${formatPerformanceEvidence(performanceData)}\n${formatSecurityEvidence(securityData)}\n${formatSeoEvidence(scrapedData)}\n
PILLAR 6 — GBP Status: ${gbpStatusText}\nBody:\n${scrapedData.bodyText.substring(0, 5000)}`;

      const prompt = `You are Hunter AI. Analyze this 7-pillar data. Base analysis entirely on the REAL DATA provided.
<data>\n${context}\n</data>
Format JSON ONLY: {"score": number, "summary": "string", "truths": ["string", "string", "string", "string", "string", "string", "string"]}`;

      analysis = await runAiAudit(prompt);

      telemetry = { mapsStatus: "SCRAPED", gbpOnly: false, gbpStatus: gbpStatusText, website: String(safeWebsiteUrl || "") };
    }

    const db = admin.firestore();
    await db.collection("leads").add({
      businessName: safeBizName, location: safeCity, email: safeEmail, whatsapp: whatsapp || null,
      score: analysis.score, telemetry, auditVersion: "v2-7pillar", timestamp: FieldValue.serverTimestamp()
    });

    sendAdminAlert(safeBizName, safeEmail, whatsapp, analysis.score).catch(() => {});
    if (whatsapp) {
      sendAuditResultToClient(whatsapp, safeBizName, analysis.score, analysis.summary, analysis.truths, String(telemetry.gbpStatus || "No Website")).catch(() => {});
    }

    if (!gbpOnly && safeWebsiteUrl) {
      relayAuditToCrm({
        domain: safeWebsiteUrl,
        companyName: safeBizName,
        contactName: typeof request.data.requesterName === "string" ? request.data.requesterName : null,
        contactEmail: safeEmail,
        contactPhone: whatsapp ?? null,
      }).catch(() => {});
    }

    return { success: true, ...analysis, telemetry };

  } catch (e: any) {
    console.error(`[performAudit] CRASH [TraceId: ${traceId}]:`, e.message);
    if (e instanceof HttpsError) throw e;
    throw new HttpsError("internal", `Neural Handshake Interrupted. ${e.message}`);
  }
});
