// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBQvZ2-w9DrJWQEgy4IarClycARAvMJIAc",
  authDomain: "happyhunterdigital-17480.firebaseapp.com",
  projectId: "happyhunterdigital-17480",
  storageBucket: "happyhunterdigital-17480.firebasestorage.app",
  messagingSenderId: "449102421348",
  appId: "1:449102421348:web:d61e0c209b93bf282fae71",
  measurementId: "G-PS04HKGEXF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// API KEYS
const PLACES_KEY = import.meta.env.VITE_PLACES_API_KEY || "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";

// FIXED: Use Cloud Function proxy to avoid CORS issues with Places API
// If you don't have a backend proxy, use the legacy Places API (New) via HTTP referrer restrictions
export const fetchMapsData = async (bizName: string, location: string) => {
  // OPTION 1: Direct API call (requires proper CORS setup in Google Cloud)
  const URL = "https://places.googleapis.com/v1/places:searchText";
  
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": PLACES_KEY,
        // FIXED: Expanded field mask with all necessary fields
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.websiteUri,places.businessStatus,places.primaryType,places.primaryTypeDisplayName,places.nationalPhoneNumber,places.regularOpeningHours,places.photos,places.reviews,places.editorialSummary,places.priceLevel"
      },
      body: JSON.stringify({
        textQuery: `${bizName} ${location}`,
        languageCode: "en",
        maxResultCount: 5, // Get more results to find best match
        locationBias: {
          circle: {
            center: {
              latitude: -25.7479, // Pretoria center
              longitude: 28.2293
            },
            radius: 50000.0 // 50km radius
          }
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Places API Error:", errorData);
      return { 
        error: true, 
        message: errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
        code: errorData.error?.code || response.status
      };
    }

    const data = await response.json();
    
    if (!data.places || data.places.length === 0) {
      return { error: true, message: "ENTITY_NOT_FOUND_IN_GRAPH", code: "NOT_FOUND" };
    }

    // Find best match (exact name match preferred)
    const bestMatch = data.places.find((p: any) => 
      p.displayName?.text?.toLowerCase().includes(bizName.toLowerCase())
    ) || data.places[0];

    return {
      found: true,
      placeId: bestMatch.id,
      name: bestMatch.displayName?.text,
      rating: bestMatch.rating || "N/A",
      reviews: bestMatch.userRatingCount || 0,
      website: bestMatch.websiteUri || "MISSING",
      address: bestMatch.formattedAddress,
      phone: bestMatch.nationalPhoneNumber || "N/A",
      status: bestMatch.businessStatus || "UNKNOWN",
      primaryType: bestMatch.primaryTypeDisplayName?.text || bestMatch.primaryType,
      openNow: bestMatch.regularOpeningHours?.openNow,
      priceLevel: bestMatch.priceLevel,
      editorialSummary: bestMatch.editorialSummary?.text,
      photos: bestMatch.photos?.length || 0,
      totalResults: data.places.length
    };
    
  } catch (err: any) {
    console.error("Fetch Error:", err);
    return { 
      error: true, 
      message: err.message,
      code: "NETWORK_ERROR"
    };
  }
};

export const callHunterAI = async (prompt: string) => {
  // FIXED: Removed space in URL
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
  
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { 
          temperature: 0.7, 
          maxOutputTokens: 4000,
          topP: 0.8,
          topK: 40
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Gemini API Error");
    }
    
    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid response structure from Gemini");
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (err: any) {
    console.error("AI Error:", err);
    return `HANDSHAKE_ERROR: ${err.message}`;
  }
};

export const performAuditAnalysis = async (bizName: string, location: string) => {
  console.log(`Starting audit for: ${bizName} in ${location}`);
  
  const mapsData = await fetchMapsData(bizName, location);
  
  // Enhanced context building
  let dataContext = "";
  
  if (mapsData.found) {
    const visibilityScore = calculateVisibilityScore(mapsData);
    dataContext = `REAL DATA RETRIEVED FROM GOOGLE KNOWLEDGE GRAPH:
    - Business Name: ${mapsData.name}
    - Rating: ${mapsData.rating}/5 (${mapsData.reviews} reviews)
    - Website: ${mapsData.website}
    - Address: ${mapsData.address}
    - Phone: ${mapsData.phone}
    - Business Status: ${mapsData.status}
    - Category: ${mapsData.primaryType}
    - Price Level: ${mapsData.priceLevel || "Not set"}
    - Photos: ${mapsData.photos} uploaded
    - Visibility Score: ${visibilityScore}/100
    - Open Now: ${mapsData.openNow !== undefined ? mapsData.openNow : "Unknown"}`;
  } else {
    dataContext = `MAPS DATA UNAVAILABLE: ${mapsData.message} (Code: ${mapsData.code}).
    This business is currently INVISIBLE in Google's Knowledge Graph.
    CRITICAL: No Google Business Profile found or API access denied.`;
  }

  const prompt = `You are Hunter AI, a forensic digital marketing auditor for Smart Marketing. 
Perform a comprehensive audit for "${bizName}" in ${location}.

${dataContext}

AUDIT PROTOCOL:
1. VISIBILITY ANALYSIS: Is the business findable? If not, explain the "Digital Black Hole" effect.
2. REPUTATION ANALYSIS: Analyze rating distribution, review velocity, and sentiment gaps.
3. ASSET ANALYSIS: Check website presence, photos, contact info completeness.
4. COMPETITIVE GAP: Compare to industry standards for ${mapsData.primaryType || "local business"}.
5. CRITICAL FAILURES: List specific missing elements that hurt discoverability.

If DATA IS MISSING: Explain exactly why AI assistants cannot recommend this business and the revenue impact.

If DATA EXISTS: Critique the profile optimization level (0-100%) and identify quick wins.

OUTPUT FORMAT:
[SECTION] Executive Summary
[SECTION] Critical Findings  
[SECTION] Strategic Requirements
[FIX] Top 3 immediate actions required
FINAL_SCORE: [0-100 based on visibility, completeness, and reputation]

RULES: No markdown asterisks. Use [H] for highlights. Be brutally honest.`;

  return await callHunterAI(prompt);
};

// Helper to calculate a preliminary visibility score
function calculateVisibilityScore(data: any): number {
  let score = 0;
  if (data.rating !== "N/A") score += 20;
  if (data.reviews > 10) score += 20;
  if (data.website !== "MISSING") score += 20;
  if (data.photos > 5) score += 15;
  if (data.phone !== "N/A") score += 15;
  if (data.priceLevel) score += 10;
  return Math.min(100, score);
}
