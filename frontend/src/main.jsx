import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { onMessage } from "firebase/messaging";
import { messaging } from "./utils/firebase";

// 🔔 Foreground message listener
onMessage(messaging, (payload) => {
  console.log("📩 Foreground FCM:", payload);

  const title =
    payload?.data?.title ||
    payload?.notification?.title ||
    "Notification";

  const body =
    payload?.data?.body ||
    payload?.notification?.body ||
    "Message received";

  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/logo.png", // public folder
    });
  } else {
    console.warn("Notification permission not granted");
  }
});


// 🔧 Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("✅ Service Worker registered:", registration);
      })
      .catch((error) => {
        console.error("❌ Service Worker registration failed:", error);
      });
  });
}

// 🚀 Render App
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
