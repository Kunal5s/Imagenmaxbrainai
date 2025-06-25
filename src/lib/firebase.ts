// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFDjcsIp_73LmYGMRvC31fNWP_nX0o238",
  authDomain: "visionforge-ai-2fzsc.firebaseapp.com",
  projectId: "visionforge-ai-2fzsc",
  storageBucket: "visionforge-ai-2fzsc.firebasestorage.app",
  messagingSenderId: "873860631451",
  appId: "1:873860631451:web:eb18891174bfef3c07af3e"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export { app };
