// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBa7CFRU0OaJWC_2PAXgd4tXDypbY1mtz8",
  authDomain: "ojasbackend.firebaseapp.com",
  projectId: "ojasbackend",
  storageBucket: "ojasbackend.firebasestorage.app",
  messagingSenderId: "86561541611",
  appId: "1:86561541611:web:5dfc5213ce5ae80d9bddae",
  measurementId: "G-Q388YK9S5E"
};

// Initialize Firebase (check if already initialized to prevent errors during hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const analytics = getAnalytics(app);

// Initialize Auth with AsyncStorage persistence for React Native
// Use getAuth if already initialized, otherwise use initializeAuth
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (error) {
  // If already initialized, just get the existing instance
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);