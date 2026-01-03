import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// 1. We import the Auth tools
import { getAuth, GoogleAuthProvider } from "firebase/auth"; 

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

// 2. CRITICAL: We must EXPORT these so AdminDashboard can use them
export const db = getFirestore(app);
export const auth = getAuth(app); 
export const googleProvider = new GoogleAuthProvider();
