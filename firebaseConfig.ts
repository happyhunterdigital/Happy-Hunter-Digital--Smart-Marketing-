import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Required for the database
import { getAnalytics } from "firebase/analytics"; // Optional, but good to have

const firebaseConfig = {
  apiKey: "AIzaSyAZHcYL0_NP0teaUOT60YeZbfQUzk8KfEk",
  authDomain: "happy-hunter-systems.firebaseapp.com",
  projectId: "happy-hunter-systems",
  storageBucket: "happy-hunter-systems.firebasestorage.app",
  messagingSenderId: "629161289232",
  appId: "1:629161289232:web:17ff042c3f96ecbeb78c95",
  measurementId: "G-4GDXX24PP0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app); // <--- CRITICAL: This allows us to save leads
const analytics = getAnalytics(app);
