// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtIJN-jnMjfP9YPci1yZEwJHH3Cmw918o",
  authDomain: "pantry-tracker-f4293.firebaseapp.com",
  projectId: "pantry-tracker-f4293",
  storageBucket: "pantry-tracker-f4293.appspot.com",
  messagingSenderId: "35542314138",
  appId: "1:35542314138:web:41bfa06851573e81ba0323",
  measurementId: "G-7B7KH0NR4C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);


export { firestore };

