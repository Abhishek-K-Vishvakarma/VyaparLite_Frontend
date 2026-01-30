// firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDvTz8ecD3canAdPBjdxbBrGjS3zE86cg0",
  authDomain: "vyaparlite-ce843.firebaseapp.com",
  projectId: "vyaparlite-ce843",
  storageBucket: "vyaparlite-ce843.firebasestorage.app",
  messagingSenderId: "812074967305",
  appId: "1:812074967305:web:0a51d90d73b11257cd33d8",
  measurementId: "G-54DJM3WKZ4"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDvTz8ecD3canAdPBjdxbBrGjS3zE86cg0",
//   authDomain: "vyaparlite-ce843.firebaseapp.com",
//   projectId: "vyaparlite-ce843",
//   storageBucket: "vyaparlite-ce843.firebasestorage.app",
//   messagingSenderId: "812074967305",
//   appId: "1:812074967305:web:0a51d90d73b11257cd33d8",
//   measurementId: "G-54DJM3WKZ4"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Next...   npm install -g firebase-tools

// 