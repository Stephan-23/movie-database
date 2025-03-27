/*import { initializeApp } from 'firebase/app';
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
export const logOut = () => signOut(auth);*/
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCmQiCA1UHw5ayVOXJMhbdHBGWtxru1-Yo",
    authDomain: "moviedatabase-beab8.firebaseapp.com",
    projectId: "moviedatabase-beab8",
    storageBucket: "moviedatabase-beab8.firebasestorage.app",
    messagingSenderId: "751874263992",
    appId: "1:751874263992:web:6a42df07d57a1e7603dd4d",
    measurementId: "G-59544VNCRX"
  };
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logOut = () => signOut(auth);

// Watchlist Functions
export const addToWatchlist = async (userId, movie) => {
  const userRef = doc(db, 'users', userId);
  try {
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      // If user document doesn't exist, create it with the watchlist
      await setDoc(userRef, { watchlist: [movie] });
    } else {
      // Add movie to existing watchlist
      await updateDoc(userRef, {
        watchlist: arrayUnion(movie),
      });
    }
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    throw error;
  }
};

export const removeFromWatchlist = async (userId, movie) => {
  const userRef = doc(db, 'users', userId);
  try {
    await updateDoc(userRef, {
      watchlist: arrayRemove(movie),
    });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    throw error;
  }
};

export const getWatchlist = async (userId) => {
  const userRef = doc(db, 'users', userId);
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data().watchlist || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    throw error;
  }
};