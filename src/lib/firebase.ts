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
  apiKey: "AIzaSyCWm-zy3haSyvpHMbx03iWjTncP6NYPncU",
  authDomain: "stunning-artifact-m8gvj.firebaseapp.com",
  projectId: "stunning-artifact-m8gvj",
  storageBucket: "stunning-artifact-m8gvj.firebasestorage.app",
  messagingSenderId: "1034558737114",
  appId: "1:1034558737114:web:a2a42f8f5c88b3c9b933e3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
export const db = getFirestore(app, "ai-studio-3dca6d06-489f-4a27-91b2-f456391819f7");

export { signInWithPopup, signInAnonymously, signOut, onAuthStateChanged };
export type { User };
