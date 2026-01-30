/* eslint-disable no-undef */

importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDvTz8ecD3canAdPBjdxbBrGjS3zE86cg0",
  authDomain: "vyaparlite-ce843.firebaseapp.com",
  projectId: "vyaparlite-ce843",
  storageBucket: "vyaparlite-ce843.firebasestorage.app",
  messagingSenderId: "812074967305",
  appId: "1:812074967305:web:0a51d90d73b11257cd33d8",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("📩 Background message:", payload);

  const title =
    payload?.data?.title ||
    payload?.notification?.title;

  const options = {
    body:
      payload?.data?.body ||
      payload?.notification?.body,
    icon: "/logo.png",
  };

  self.registration.showNotification(title, options);
});
