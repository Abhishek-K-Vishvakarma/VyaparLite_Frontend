import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

console.log(messaging);

export const getFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: "BCL98nu2rey628rLD5Igue683rpyELMOKUekwXPFoa66DpoRMJB_yx0jYgp2j7TFt71B_hqf_XiGQfJNGGSQ54U", // 87 character long
    });

    return token;
  } catch (error) {
    console.error("FCM Token Error:", error);
    return null;
  }
};
