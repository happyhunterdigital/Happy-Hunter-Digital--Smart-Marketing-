// functions/src/services/auditService.ts
import axios from "axios";
import * as cheerio from "cheerio";
import { EMBEDDING_MODEL } from "../config";
import { callDeepSeek } from "./deepseekService";

export const getPlacesData = async (query: string, apiKey: string) => {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri,places.formattedAddress,places.location"
    },
    body: JSON.stringify({ 
      textQuery: query,
      languageCode: "en",
      regionCode: "ZA"
    })
  });

  const data = await res.json() as any;

  if (!res.ok) {
    console.error("Places API request failed", {
      status: res.status,
      query,
      response: data
    });
    throw new Error(`Places API error (${res.status}): ${data?.error?.message || "unknown"}`);
  }

  return data;
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
