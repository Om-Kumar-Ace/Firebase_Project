import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA_pJG5tmgb5sDZk7o1Kl_99k-I4CQA_fw",
    authDomain: "support-desk-4ae79.firebaseapp.com",
    projectId: "support-desk-4ae79",
    storageBucket: "support-desk-4ae79.firebasestorage.app",
    messagingSenderId: "565888744420",
    appId: "1:565888744420:web:909d06f131db32e987a5f1",
    measurementId: "G-22EJ805MBX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
