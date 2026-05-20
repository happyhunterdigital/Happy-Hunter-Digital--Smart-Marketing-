// functions/src/services/auditService.ts
import axios from "axios";
import * as cheerio from "cheerio";

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
