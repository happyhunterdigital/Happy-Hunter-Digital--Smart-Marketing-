import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const getPlaceData = functions.https.onCall(async (data, context) => {
  const { bizName, location } = data;
  
  if (!bizName || !location) {
    throw new functions.https.HttpsError('invalid-argument', 'Business name and location required');
  }

  const apiKey = functions.config().places?.key;
  
  if (!apiKey) {
    console.error("[getPlaceData] API key not configured");
    throw new functions.https.HttpsError('failed-precondition', 'Places API key not configured. Run: firebase functions:config:set places.key="YOUR_KEY"');
  }

  try {
    console.log(`[getPlaceData] Querying: ${bizName} in ${location}`);
    
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.id,places.displayName,places.rating,places.userRatingCount,places.websiteUri,places.formattedAddress,places.businessStatus,places.primaryType,places.nationalPhoneNumber,places.regularOpeningHours,places.photos,places.priceLevel"
      },
      body: JSON.stringify({
        textQuery: `${bizName} ${location}`,
        maxResultCount: 3,
        languageCode: "en"
      })
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error(`[getPlaceData] Places API error: ${response.status} - ${responseText}`);
      throw new functions.https.HttpsError('internal', `Places API error: ${response.status} - ${responseText}`);
    }

    const result = JSON.parse(responseText);
    console.log(`[getPlaceData] Found ${result.places?.length || 0} places`);
    
    return result;
    
  } catch (error: any) {
    console.error("[getPlaceData] Function error:", error);
    throw new functions.https.HttpsError('internal', error.message || "Unknown error");
  }
});
