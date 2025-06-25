
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration is now hardcoded for direct deployment.
const firebaseConfig = {
  apiKey: "AIzaSyDLw0k0QwcRlSXTaBQDJvGqZJL3NKLhtNM",
  authDomain: "imagenmax-brain-ai.firebaseapp.com",
  projectId: "imagenmax-brain-ai",
  storageBucket: "imagenmax-brain-ai.appspot.com",
  messagingSenderId: "935856133474",
  appId: "1:935856133474:web:aa9ec60c401e97d99c483b"
};


const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export { app };
