import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyBQvZ2-w9DrJWQEgy4IarClycARAvMJIAc",
  authDomain: "happyhunterdigital-17480.firebaseapp.com",
  projectId: "happyhunterdigital-17480",
  storageBucket: "happyhunterdigital-17480.firebasestorage.app",
  messagingSenderId: "449102421348",
  appId: "1:449102421348:web:d61e0c209b93bf282fae71"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

const functions = getFunctions(app);

// Uncomment for local testing
// if (import.meta.env.DEV) {
//   connectFunctionsEmulator(functions, "127.0.0.1", 5001);
// }

const getPlaceDataFn = httpsCallable(functions, 'getPlaceData');

const GEMINI_KEY = "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";

export const callHunterAI = async (prompt: string): Promise<string> => {
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
  
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 4000 }
      })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return `AI_ERROR: ${error.error?.message || response.statusText}`;
    }
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "AI_ERROR: Empty response";
  } catch (err: any) {
    return `HANDSHAKE_ERROR: ${err.message}`;
  }
};

export const fetchMapsData = async (bizName: string, location: string) => {
  try {
    console.log(`[Places] Querying: ${bizName} in ${location}`);
    
    const result = await getPlaceDataFn({ bizName, location });
    const data = result.data as any;
    
    console.log("[Places] Response:", data);

    if (!data.places || data.places.length === 0) {
      return {
        found: false,
        error: true,
        message: "ENTITY_NOT_FOUND_IN_KNOWLEDGE_GRAPH",
        suggestion: "Business is not verified on Google Maps or lacks digital presence"
      };
    }

    const biz = data.places[0];
    return {
      found: true,
      name: biz.displayName?.text || bizName,
      rating: biz.rating || null,
      reviewCount: biz.userRatingCount || 0,
      website: biz.websiteUri || null,
      address: biz.formattedAddress || location,
      status: biz.businessStatus || "UNKNOWN",
      category: biz.primaryType || "Unknown",
      phone: biz.nationalPhoneNumber || null,
      openNow: biz.regularOpeningHours?.openNow || null,
      priceLevel: biz.priceLevel || null,
      photos: biz.photos?.length || 0
    };
    
  } catch (err: any) {
    console.error("[Places] Error:", err);
    return {
      found: false,
      error: true,
      message: `PROXY_ERROR: ${err.message || err.code || "Unknown error"}`,
      code: err.code || "UNKNOWN"
    };
  }
};

export const performAuditAnalysis = async (bizName: string, location: string): Promise<string> => {
  console.log(`[Audit] Starting for: ${bizName} in ${location}`);
  
  const mapsData = await fetchMapsData(bizName, location);
  
  let dataContext = "";
  
  if (mapsData.found) {
    const stars = mapsData.rating ? `${mapsData.rating}/5` : "No rating";
    const reviews = mapsData.reviewCount > 0 ? `${mapsData.reviewCount} reviews` : "No reviews";
    const webStatus = mapsData.website ? `Website: ${mapsData.website}` : "NO WEBSITE LINKED";
    const phoneStatus = mapsData.phone ? `Phone: ${mapsData.phone}` : "NO PHONE LISTED";
    
    dataContext = `✓ VERIFIED GOOGLE BUSINESS PROFILE FOUND
- Business Name: ${mapsData.name}
- Rating: ${stars} (${reviews})
- Address: ${mapsData.address}
- Status: ${mapsData.status}
- Category: ${mapsData.category}
- ${webStatus}
- ${phoneStatus}
- Photos: ${mapsData.photos} uploaded
- Open Now: ${mapsData.openNow !== null ? mapsData.openNow : "Unknown"}`;
  } else {
    dataContext = `✗ CRITICAL: NO GOOGLE PRESENCE DETECTED
Error Code: ${mapsData.message}
Diagnosis: ${mapsData.suggestion}

This business is currently INVISIBLE to:
- Google Maps searches
- AI assistants (Gemini, ChatGPT, Siri)
- Local "near me" queries
- Google Business Profile ecosystem

REVENUE IMPACT: Potential customers cannot find this business. All searches go to competitors with verified profiles.`;
  }

  const prompt = `You are Hunter AI, lead strategist at Smart Marketing South Africa. Perform a Forensic Strategic Audit.

BUSINESS: "${bizName}" in ${location}

${dataContext}

AUDIT PROTOCOL:
1. VISIBILITY STATUS: Is this business findable in the AI era? If NO DATA, explain the "Digital Black Hole" effect on revenue.
2. REPUTATION ANALYSIS: If data exists, critique rating/review count vs industry standards. If missing, explain why AI won't recommend them.
3. COMPETITIVE GAPS: List 3 specific things competitors are doing that this business isn't.
4. AI READINESS: Can Gemini/ChatGPT cite this business? Why or why not?

OUTPUT RULES:
- NO asterisks (*), NO markdown bullets, NO bold syntax
- Use [SECTION] for headers: [SECTION] Executive Summary
- Use [FIX] for action items: [FIX] Immediate action required
- Use CAPS for critical failures and emphasis
- End with exactly: FINAL_SCORE: [0-100]

SCORING GUIDE:
0-20 = Invisible (no GBP or unverified)
21-40 = Weak (GBP exists but incomplete/poor)
41-60 = Average (GBP active, needs optimization)
61-80 = Strong (well-optimized, good ratings)
81-100 = Dominant (authoritative, highly cited, complete)`;

  console.log("[Audit] Sending to AI...");
  return await callHunterAI(prompt);
};
