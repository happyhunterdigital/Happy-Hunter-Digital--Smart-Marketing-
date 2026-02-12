import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Initialize Firebase with hardcoded config (safe for client)
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

// API Keys from environment variables
const PLACES_API_KEY = import.meta.env.VITE_PLACES_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Debug logging (visible in browser console)
console.log("[FirebaseConfig] Environment check:", {
  placesKeyExists: !!PLACES_API_KEY,
  placesKeyLength: PLACES_API_KEY ? PLACES_API_KEY.length : 0,
  geminiKeyExists: !!GEMINI_API_KEY,
  geminiKeyLength: GEMINI_API_KEY ? GEMINI_API_KEY.length : 0,
  mode: import.meta.env.MODE
});

// City coordinates for location bias
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  "cape town": { lat: -33.9249, lng: 18.4241 },
  "johannesburg": { lat: -26.2041, lng: 28.0473 },
  "pretoria": { lat: -25.7479, lng: 28.2293 },
  "durban": { lat: -29.8587, lng: 31.0218 },
  "gqeberha": { lat: -33.9608, lng: 25.6022 },
  "port elizabeth": { lat: -33.9608, lng: 25.6022 },
  "bloemfontein": { lat: -29.0852, lng: 26.1596 },
  "nelspruit": { lat: -25.4753, lng: 30.9694 },
  "polokwane": { lat: -23.9045, lng: 29.4688 },
  "rustenburg": { lat: -25.6676, lng: 27.2421 }
};

interface MapsDataSuccess {
  found: true;
  name: string;
  rating?: number;
  reviewCount: number;
  website?: string;
  isOpen?: boolean;
  status?: string;
  mapsUrl?: string;
  address?: string;
}

interface MapsDataError {
  found: false;
  error: string;
  message: string;
}

type MapsDataResult = MapsDataSuccess | MapsDataError;

export const fetchMapsData = async (
  bizName: string, 
  location: string
): Promise<MapsDataResult> => {
  console.log("[fetchMapsData] Starting search:", { bizName, location });

  if (!PLACES_API_KEY) {
    console.error("[fetchMapsData] PLACES_API_KEY is missing");
    return {
      found: false,
      error: "CONFIG_ERROR",
      message: "Places API key not configured. Check GitHub secrets."
    };
  }

  const normalizedLocation = location.toLowerCase().trim();
  const coords = CITY_COORDS[normalizedLocation];

  try {
    const url = "https://places.googleapis.com/v1/places:searchText";
    
    const requestBody: any = {
      textQuery: `${bizName} in ${location}`,
      maxResultCount: 3
    };

    // Add location bias if we have coordinates
    if (coords) {
      requestBody.locationBias = {
        circle: {
          center: {
            latitude: coords.lat,
            longitude: coords.lng
          },
          radius: 50000.0 // 50km radius
        }
      };
    }

    console.log("[fetchMapsData] Making API request...");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": PLACES_API_KEY,
        "X-Goog-FieldMask": "places.displayName.text,places.formattedAddress,places.rating,places.userRatingCount,places.websiteUri,places.regularOpeningHours.openNow,places.businessStatus,places.googleMapsUri"
      },
      body: JSON.stringify(requestBody)
    });

    console.log("[fetchMapsData] Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[fetchMapsData] HTTP error:", errorText);
      return {
        found: false,
        error: "API_ERROR",
        message: `Places API returned ${response.status}: ${errorText}`
      };
    }

    const data = await response.json();
    console.log("[fetchMapsData] Response data:", data);

    if (!data.places || data.places.length === 0) {
      console.log("[fetchMapsData] No places found");
      return {
        found: false,
        error: "NOT_FOUND",
        message: `No Google Maps listing found for "${bizName}" in ${location}. The business may be unlisted or using a different name.`
      };
    }

    const place = data.places[0];
    
    return {
      found: true,
      name: place.displayName?.text || bizName,
      rating: place.rating,
      reviewCount: place.userRatingCount || 0,
      website: place.websiteUri,
      isOpen: place.regularOpeningHours?.openNow,
      status: place.businessStatus,
      mapsUrl: place.googleMapsUri,
      address: place.formattedAddress
    };

  } catch (err: any) {
    console.error("[fetchMapsData] Exception:", err);
    return {
      found: false,
      error: "FETCH_ERROR",
      message: err.message || "Unknown error occurred"
    };
  }
};

export const callHunterAI = async (prompt: string): Promise<string> => {
  console.log("[callHunterAI] Starting AI call...");

  if (!GEMINI_API_KEY) {
    console.error("[callHunterAI] GEMINI_API_KEY is missing");
    throw new Error("Gemini API key not configured");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[callHunterAI] HTTP error:", errorData);
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("[callHunterAI] No text in response:", data);
      throw new Error("Empty response from AI");
    }

    console.log("[callHunterAI] Success, response length:", text.length);
    return text;

  } catch (err: any) {
    console.error("[callHunterAI] Exception:", err);
    throw err;
  }
};

export const performAuditAnalysis = async (
  bizName: string, 
  location: string
): Promise<string> => {
  console.log("[performAuditAnalysis] Starting for:", bizName, location);

  // Step 1: Fetch real Maps data
  const mapsData = await fetchMapsData(bizName, location);
  console.log("[performAuditAnalysis] Maps data:", mapsData);

  // Step 2: Build context for AI
  let context: string;

  if (!mapsData.found) {
    context = `
CRITICAL FINDING: Google Maps Intelligence Unavailable
Error Type: ${mapsData.error}
Details: ${mapsData.message}

IMPLICATION: This business has NO verifiable Google Maps presence. This represents a complete digital invisibility crisis. Customers cannot find location, hours, reviews, or contact information through Google Search or Maps. AI systems have zero data to reference.
`;
  } else {
    const healthScore = (
      (mapsData.rating ? 25 : 0) +
      (mapsData.reviewCount > 10 ? 25 : mapsData.reviewCount > 0 ? 15 : 0) +
      (mapsData.website ? 25 : 0) +
      (mapsData.status === "OPERATIONAL" ? 25 : 0)
    );

    context = `
REAL GOOGLE MAPS INTELLIGENCE:
✓ Entity Name: ${mapsData.name}
✓ Rating: ${mapsData.rating || "NO RATING"} (${mapsData.reviewCount} reviews)
✓ Profile Health Score: ${healthScore}/100
✓ Website: ${mapsData.website || "MISSING - CRITICAL"}
✓ Business Status: ${mapsData.status || "UNKNOWN"}
✓ Currently Open: ${mapsData.isOpen !== undefined ? (mapsData.isOpen ? "YES" : "NO") : "UNKNOWN"}
✓ Maps URL: ${mapsData.mapsUrl || "NOT AVAILABLE"}
✓ Address: ${mapsData.address || "NOT AVAILABLE"}

COMPETITIVE BENCHMARK:
- Market Entry: 4.0+ rating, 20+ reviews, complete profile
- AI Trust Threshold: 4.2+ rating, verified website, active status
- Current Standing: ${mapsData.rating && mapsData.rating >= 4.0 ? "MEETS" : "BELOW"} rating | ${mapsData.reviewCount >= 20 ? "MEETS" : "BELOW"} reviews
`;
  }

  // Step 3: Build and send prompt
  const prompt = `You are Hunter AI, lead digital strategist at Smart Marketing South Africa.

AUDIT TARGET: "${bizName}" in ${location}

${context}

MISSION: Deliver an unsparing forensic analysis that exposes every digital vulnerability with surgical precision.

REQUIRED STRUCTURE:

[SECTION] THE MAPS VERDICT
Analyze the Maps intelligence. If no presence: emphasize complete digital invisibility and revenue impact. If present: critique rating quality, review velocity, and profile completeness against market standards.

[SECTION] LOCAL SEO & GMB FAILURES
Specific technical failures: ${!mapsData.found ? "Complete absence from Google Maps - zero local search visibility" : "Gaps in profile optimization and data completeness"}.

[SECTION] AI VISIBILITY & AEO CRISIS
Explain why Gemini, ChatGPT, and Google SGE cannot/will not recommend this business. Reference specific missing trust signals.

[SECTION] ESTIMATED REVENUE IMPACT
Calculate approximate monthly revenue loss from poor visibility. Consider: lost local search traffic × conversion rate × average transaction value.

[SECTION] STRATEGIC RECOVERY PROTOCOL
[FIX] Immediate Action (0-7 days): Highest impact quick wins
[FIX] 30-Day Sprint: Foundation rebuilding
[FIX] 90-Day Authority Build: Market dominance positioning

MANDATORY: End with exactly: FINAL_SCORE: [number 0-100]

RULES:
- Use [H] for emphasis on critical failures
- No asterisks (*), no markdown, no bullet points
- Tone: Strategic, authoritative, unsparing
- Be specific about revenue impact and competitive disadvantage
- If rating < 4.0: emphasize reputation crisis
- If reviews < 10: emphasize trust deficit
- If no website: emphasize conversion black hole`;

  console.log("[performAuditAnalysis] Calling AI...");
  const result = await callHunterAI(prompt);
  console.log("[performAuditAnalysis] Complete");
  
  return result;
};
