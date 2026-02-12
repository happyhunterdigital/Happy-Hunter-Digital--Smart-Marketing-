import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase config
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

// API Keys
const PLACES_KEY = "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";
const GEMINI_KEY = "AIzaSyDImAFg8zzlljI1XG38mYXClH3gPa522hs";

// FIXED: Removed space in URL
export const callHunterAI = async (prompt: string) => {
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
  
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 2500 }
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error("Gemini API Error:", error);
      return `AI_ERROR: ${error.error?.message || response.statusText}`;
    }
    
    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return "AI_ERROR: Invalid response structure";
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (err: any) {
    console.error("AI Fetch Error:", err);
    return `HANDSHAKE_ERROR: ${err.message}`;
  }
};

// FIXED: Removed trailing space, added proper error handling, returns structured object
export const fetchMapsData = async (bizName: string, location: string) => {
  const URL = "https://places.googleapis.com/v1/places:searchText"; // NO TRAILING SPACE
  
  try {
    console.log(`Fetching Places data for: ${bizName} in ${location}`);
    
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": PLACES_KEY,
        "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri,places.formattedAddress,places.businessStatus,places.primaryType"
      },
      body: JSON.stringify({ 
        textQuery: `${bizName} ${location}`, // Removed "in" - better for API matching
        maxResultCount: 3, // Get a few results to find best match
        languageCode: "en"
      })
    });

    // Log the raw response for debugging
    console.log("Places API Status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Places API Error Response:", errorText);
      return { 
        error: true, 
        message: `API_ERROR_${response.status}: ${errorText}`,
        raw: errorText
      };
    }

    const data = await response.json();
    console.log("Places API Data:", data);
    
    if (!data.places || data.places.length === 0) {
      return { 
        error: true, 
        message: "ENTITY_NOT_FOUND_IN_GOOGLE_GRAPH",
        suggestion: "Business is not verified or listed on Google Maps"
      };
    }
    
    // Get the best match (first result usually best)
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
      raw: biz // Keep raw data for debugging
    };
    
  } catch (err: any) {
    console.error("Places Fetch Exception:", err);
    return { 
      error: true, 
      message: `FETCH_EXCEPTION: ${err.message}`,
      code: err.name
    };
  }
};

// FIXED: Properly structured analysis with real data integration
export const performAuditAnalysis = async (bizName: string, location: string) => {
  console.log(`Starting audit for ${bizName}...`);
  
  const mapsData = await fetchMapsData(bizName, location);
  
  // Build context based on real data or failure
  let dataContext = "";
  
  if (mapsData.found) {
    const stars = mapsData.rating ? `${mapsData.rating}/5` : "No rating";
    const reviews = mapsData.reviewCount > 0 ? `${mapsData.reviewCount} reviews` : "No reviews";
    const webStatus = mapsData.website ? `Website: ${mapsData.website}` : "NO WEBSITE LINKED";
    
    dataContext = `VERIFIED GOOGLE BUSINESS PROFILE FOUND:
- Name: ${mapsData.name}
- Rating: ${stars} (${reviews})
- Address: ${mapsData.address}
- Status: ${mapsData.status}
- Category: ${mapsData.category}
- ${webStatus}`;
    
  } else {
    dataContext = `CRITICAL FAILURE - NO GOOGLE PRESENCE:
Error: ${mapsData.message}
Diagnosis: ${mapsData.suggestion || "Business is invisible to Google Maps API"}
Impact: AI assistants cannot recommend this business. Local SEO is non-existent.`;
  }

  const prompt = `You are Hunter AI, lead strategist at Smart Marketing. Perform a Forensic Strategic Audit.

BUSINESS: "${bizName}" in ${location}

REAL DATA FROM GOOGLE MAPS API:
${dataContext}

AUDIT REQUIREMENTS:
1. If NO DATA FOUND: Explain the "Digital Black Hole" - why being unfindable on Google Maps kills revenue. Be specific about lost opportunities.
2. If DATA FOUND: Analyze the profile strength. Critique missing elements (photos, posts, Q&A, description). Compare rating/review count to industry averages.
3. Identify 3 specific competitive gaps.
4. Give brutally honest assessment of their AI visibility (ChatGPT, Gemini, Siri recommendations).

OUTPUT RULES:
- NO asterisks (*), NO markdown, NO bullet points
- Use [SECTION] for headers
- Use [FIX] for action items  
- Use CAPS for emphasis on critical failures
- End with exactly: FINAL_SCORE: [0-100]

The score must reflect real findability: 0-20 = Invisible, 21-40 = Weak, 41-60 = Average, 61-80 = Strong, 81-100 = Dominant.`;

  console.log("Sending prompt to AI...");
  return await callHunterAI(prompt);
};
