import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC1y6gC2R2TMovnxkokd0ZOSPNmknVsE5w",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "poli-jantung-production.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "poli-jantung-production",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "poli-jantung-production.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1070898523312",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1070898523312:web:ac50bf1e652a07443e5f75",
};

// NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyC1y6gC2R2TMovnxkokd0ZOSPNmknVsE5w"
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="poli-jantung-production.firebaseapp.com"
// NEXT_PUBLIC_FIREBASE_PROJECT_ID="poli-jantung-production"
// NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="poli-jantung-production.firebasestorage.app"
// NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1070898523312"
// NEXT_PUBLIC_FIREBASE_APP_ID="1:1070898523312:web:ac50bf1e652a07443e5f75"


if (!firebaseConfig.apiKey) {
  throw new Error(
    "Missing Firebase configuration. Did you set the NEXT_PUBLIC_FIREBASE_* env vars?"
  );
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
