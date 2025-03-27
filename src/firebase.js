
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};
const app = initializeApp(firebaseConfig);export const auth = getAuth(app);
export const db = getFirestore(app);export const googleProvider = new GoogleAuthProvider();export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logOut = () => signOut(auth);// Watchlist Functions
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
};export const removeFromWatchlist = async (userId, movie) => {
  const userRef = doc(db, 'users', userId);
  try {
    await updateDoc(userRef, {
      watchlist: arrayRemove(movie),
    });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    throw error;
  }
};export const getWatchlist = async (userId) => {
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

