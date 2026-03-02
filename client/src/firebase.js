// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-643bb.firebaseapp.com",
  projectId: "mern-estate-643bb",
  storageBucket: "mern-estate-643bb.firebasestorage.app",
  messagingSenderId: "131434978994",
  appId: "1:131434978994:web:b0dd742b1f67d5d5c833ab"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);