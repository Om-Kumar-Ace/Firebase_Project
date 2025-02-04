// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import 'firebase/auth';
import 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDl3yRmRodm7yFL2e9wJm8EL5HGmcxgf7I",
  authDomain: "customer-support-31f0d.firebaseapp.com",
  projectId: "customer-support-31f0d",
  storageBucket: "customer-support-31f0d.firebasestorage.app",
  messagingSenderId: "957422672473",
  appId: "1:957422672473:web:6befee367896f26571af48",
  measurementId: "G-3BSP1ZFS0H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = firebaseApp.auth();
export const firestore = firebaseApp.firestore();
export default firebaseApp;