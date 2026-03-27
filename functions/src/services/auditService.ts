import axios from "axios";
import * as cheerio from "cheerio";
import { AI_MODEL, SAFETY_SETTINGS } from "../config";

export const getPlacesData = async (query: string, apiKey: string) => {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri"
    },
    body: JSON.stringify({ textQuery: query })
  });
  return res.json() as any;
};

export const scrapeWebsiteSchema = async (url: string) => {
  try {
    const webRes = await axios.get(url, {
      timeout: 6000,
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
    });
    const $ = cheerio.load(webRes.data);
    let detected: string[] = [];
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const json = JSON.parse($(el).html() || "{}");
        const extract = (obj: any) => {
          if (!obj) return;
          if (Array.isArray(obj)) obj.forEach(extract);
          else if (typeof obj === 'object') {
            if (obj['@type']) detected.push(obj['@type']);
            if (obj['@graph']) extract(obj['@graph']);
          }
        };
        extract(json);
      } catch (e) {}
    });
    return [...new Set(detected)];
  } catch (err) {
    return [];
  }
};

export const callGeminiAudit = async (prompt: string, gKey: string) => {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent?key=${gKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      safetySettings: SAFETY_SETTINGS,
      generationConfig: { responseMimeType: "application/json" }
    })
  });
  if (!res.ok) throw new Error(`Gemini Error: ${res.status}`);
  return res.json() as any;
};
