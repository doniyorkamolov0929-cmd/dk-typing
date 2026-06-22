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
  apiKey: "AIzaSyCYr4TEnQ1mh22mBVnR0KsXpjtPGyhuOkk",
  authDomain: "dk-typing-ff7bf.firebaseapp.com",
  projectId: "dk-typing-ff7bf",
  storageBucket: "dk-typing-ff7bf.firebasestorage.app",
  messagingSenderId: "1045805192414",
  appId: "1:1045805192414:web:8e645307ea871320a69e4f"
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
