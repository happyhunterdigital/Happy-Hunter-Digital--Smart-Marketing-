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
        message: `Places
