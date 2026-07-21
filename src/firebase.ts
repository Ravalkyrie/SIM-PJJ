import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBbE2hDgs0lLQk4A0ruIBN2h-bmHBvO7jA",
  authDomain: "simpjj-ebfe7.firebaseapp.com",
  projectId: "simpjj-ebfe7",
  storageBucket: "simpjj-ebfe7.firebasestorage.app",
  messagingSenderId: "1066406666067",
  appId: "1:1066406666067:web:4f427091402ddc5a7e8ba6",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);