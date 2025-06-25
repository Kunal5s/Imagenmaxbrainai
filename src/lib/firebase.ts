// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration is now hardcoded for direct deployment.
const firebaseConfig = {
  apiKey: "AIzaSyDFDjcsIp_73LmYGMRvC31fNWP_nX0o238",
  authDomain: "visionforge-ai-2fzsc.firebaseapp.com",
  projectId: "visionforge-ai-2fzsc",
  storageBucket: "visionforge-ai-2fzsc.appspot.com",
  messagingSenderId: "873860631451",
  appId: "1:873860631451:web:5ff694dfa7c6005f07af3e"
};


const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export { app };
