import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCmQiCA1UHw5ayVOXJMhbdHBGWtxru1-Yo",
    authDomain: "moviedatabase-beab8.firebaseapp.com",
    projectId: "moviedatabase-beab8",
    storageBucket: "moviedatabase-beab8.firebasestorage.app",
    messagingSenderId: "751874263992",
    appId: "1:751874263992:web:6a42df07d57a1e7603dd4d",
    measurementId: "G-59544VNCRX"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth Provider for sign-in
export const googleProvider = new GoogleAuthProvider();

// Functions for sign-in and sign-out
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logOut = () => signOut(auth);