import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";


export const firebaseConfig = {
  apiKey: "AIzaSyB5KPrhWZpPNYk7pgdoWA1GxgKqB8YrboQ",
  authDomain: "book-finders.firebaseapp.com",
  projectId: "book-finders",
  storageBucket: "book-finders.appspot.com",
  messagingSenderId: "332797696435",
  appId: "1:332797696435:web:edccb29eabd34996c513c6",
  measurementId: "G-P3N16H03CJ"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);

export { db };
