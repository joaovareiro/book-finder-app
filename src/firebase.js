// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyB5KPrhWZpPNYk7pgdoWA1GxgKqB8YrboQ",
  authDomain: "book-finders.firebaseapp.com",
  projectId: "book-finders",
  storageBucket: "book-finders.appspot.com",
  messagingSenderId: "332797696435",
  appId: "1:332797696435:web:edccb29eabd34996c513c6",
  measurementId: "G-P3N16H03CJ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const firestore = getFirestore(app);
/*
  firestore.collection("livros").add({
    titulo: "Meu Livro",
    autor: "Autor do Livro",
  });
*/