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
      "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri"
    },
    body: JSON.stringify({ textQuery: query })
  });
  return res.json() as any;
};

export const getEmbedding = async (text: string, apiKey: string) => {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: `models/${EMBEDDING_MODEL}`, content: { parts: [{ text }] } })
  });
  const data = await res.json() as any;
  return data?.embedding?.values || null;
};

export const scrapeWebsiteSchema = async (url: string) => {
  try {
    const webRes = await axios.get(url, { timeout: 6000, headers: { "User-Agent": "Mozilla/5.0" } });
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
    return [];
  }
};

export const callDeepSeekAudit = async (prompt: string) => {
  const jsonString = await callDeepSeek(
    [
      {
        role: "system",
        content: "You are an AI auditor. Output only valid JSON matching the requested schema. No extra text.",
      },
      { role: "user", content: prompt },
    ],
    { jsonMode: true, temperature: 0.0 }
  );
  return JSON.parse(jsonString);
};
