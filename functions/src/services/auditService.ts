// functions/src/services/auditService.ts
import axios from "axios";
import * as cheerio from "cheerio";
import { callDeepSeek } from "./deepseekService";

export interface ScrapedSiteData {
  title: string;
  description: string;
  viewport: string;
  schemas: string[];
  bodyText: string;
}

export const scrapeWebsiteText = async (url: string): Promise<ScrapedSiteData> => {
  let targetUrl = url.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = `https://${targetUrl}`;
  }

  try {
    const response = await axios.get(targetUrl, {
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      maxRedirects: 5
    });

    const html = response.data;
    if (typeof html !== "string") {
      throw new Error("Invalid response content type");
    }

    const $ = cheerio.load(html);

    // 1. Extract Meta elements
    const title = $("title").text() || $("meta[property='og:title']").attr("content") || "";
    const description = $("meta[name='description']").attr("content") || $("meta[property='og:description']").attr("content") || "";
    const viewport = $("meta[name='viewport']").attr("content") || "";

    // 2. Extract Schemas
    const schemas: string[] = [];
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const json = JSON.parse($(el).html() || "{}");
        const extract = (obj: any) => {
          if (!obj) return;
          if (Array.isArray(obj)) obj.forEach(extract);
          else if (obj['@type']) schemas.push(obj['@type']);
        };
        extract(json);
      } catch (e) {}
    });
    const uniqueSchemas = [...new Set(schemas)];

    // 3. Extract Clean Body Text (remove scripts, styles, layout wrappers to isolate core marketing context)
    $("script, style, iframe, noscript, svg, header, footer, nav").remove();
    const bodyText = $("body").text() || $("html").text() || "";
    const cleanText = bodyText
      .replace(/\s+/g, " ")
      .replace(/\n+/g, " ")
      .trim()
      .slice(0, 5000);

    return {
      title: title.trim(),
      description: description.trim(),
      viewport: viewport.trim(),
      schemas: uniqueSchemas,
      bodyText: cleanText
    };
  } catch (err: any) {
    console.error(`[scrapeWebsiteText] Failed to fetch target site ${targetUrl}:`, err.message);
    throw new Error(`Website unreachable: ${err.message}. Please check the URL and try again.`);
  }
};

export const scrapeWebsiteSchema = async (url: string) => {
  try {
    const webRes = await axios.get(url, { 
      timeout: 8000, 
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      maxRedirects: 5
    });
    const $ = cheerio.load(webRes.data);
    let detected: string[] = [];
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const json = JSON.parse($(el).html() || "{}");
        const extract = (obj: any) => {
          if (!obj) return;
          if (Array.isArray(obj)) obj.forEach(extract);
          else if (obj['@type']) detected.push(obj['@type']);
        };
        extract(json);
      } catch (e) {}
    });
    return [...new Set(detected)];
  } catch (err) {
    console.error("Schema scraping failed:", (err as any).message);
    return [];
  }
};

export const callDeepSeekAudit = async (prompt: string) => {
  const jsonString = await callDeepSeek(
    [
      {
        role: "system",
        content: "You are Hunter AI, a ruthless digital marketing auditor. Output only valid JSON matching the requested schema. No extra text, no markdown fences.",
      },
      { role: "user", content: prompt },
    ],
    { jsonMode: true, temperature: 0.0, maxRetries: 2 }
  );
  
  try {
    return JSON.parse(jsonString);
  } catch (parseError: any) {
    console.error("[callDeepSeekAudit] DeepSeek returned invalid JSON:", jsonString, parseError.message);
    // Safe self-healing fallback scorecard
    return {
      score: 30,
      summary: "AI systems could not securely synthesize this business's digital footprint. An authority framework is required to verify their entity profile for search engines.",
      truths: [
        "Digital Authority Scan: Unreachable",
        "Website Indexing: Unverified",
        "AEO Schema Markup: Missing"
      ]
    };
  }
};
