import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; 
import { getAuth, GoogleAuthProvider } from "firebase/auth"; 

// Your exact configuration
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
const analytics = getAnalytics(app);

// Export the tools so the app can use them
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
