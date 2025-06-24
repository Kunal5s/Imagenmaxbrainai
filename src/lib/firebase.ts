// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import type { Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxbMsK90sgOQp1G4fICfH1v1a6-bZV-Hg",
  authDomain: "pixel-mart-454406.firebaseapp.com",
  projectId: "pixel-mart-454406",
  storageBucket: "pixel-mart-454406.firebasestorage.app",
  messagingSenderId: "349994441662",
  appId: "1:349994441662:web:5bad52a827b29a02b6f7ef",
  measurementId: "G-L359DEQQ4J"
};

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
let analytics: Analytics | undefined;

// Ensure analytics is only initialized on the client side
if (typeof window !== 'undefined') {
  if (firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
  }
}

export { app, analytics };
