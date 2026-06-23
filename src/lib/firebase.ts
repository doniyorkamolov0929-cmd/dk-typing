import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously, 
  signOut, 
  onAuthStateChanged,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCYr4TEnQ1mh22mBvnR0KsXPjtPGyhuOkk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dk-typing-ff7bf.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dk-typing-ff7bf",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dk-typing-ff7bf.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1045805192414",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1045805192414:web:8e645307ea871320a69e4f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
export const db = getFirestore(app);

export { signInWithPopup, signInAnonymously, signOut, onAuthStateChanged };
export type { User };
