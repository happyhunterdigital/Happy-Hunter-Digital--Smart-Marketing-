import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// This pulls the JSON string we saved in your GitHub Secrets
const firebaseConfigString = import.meta.env.VITE_FIREBASE_CONFIG;

let app;
let db: any = null;

try {
  if (firebaseConfigString) {
    const config = JSON.parse(firebaseConfigString);
    app = initializeApp(config);
    db = getFirestore(app);
    console.log("✅ Firebase Entity Connected.");
  }
} catch (error) {
  console.error("❌ Firebase Initialization Failed:", error);
}

export { db };
