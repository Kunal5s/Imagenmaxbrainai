// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
let analytics;

// Ensure analytics is only initialized on the client side where window is available
if (typeof window !== 'undefined') {
  if (firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
  }
}

export { app, analytics };
