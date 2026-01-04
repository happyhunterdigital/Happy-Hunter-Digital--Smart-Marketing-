import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 

// Your NEW Unrestricted Key
const firebaseConfig = {
  apiKey: "AIzaSyCqCYLwHtmlJHVVkDckpr_S1o4QKgFyN-M",
  authDomain: "happy-hunter-systems.firebaseapp.com",
  projectId: "happy-hunter-systems",
  storageBucket: "happy-hunter-systems.firebasestorage.app",
  messagingSenderId: "629161289232",
  appId: "1:629161289232:web:17ff042c3f96ecbeb78c95",
  measurementId: "G-4GDXX24PP0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the tools so the app can use them
export const db = getFirestore(app);
export const auth = getAuth(app);
