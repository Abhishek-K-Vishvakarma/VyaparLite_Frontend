// import { createContext, useContext, useState } from "react";

// const NotificationContext = createContext();

// export const NotificationProvider = ({ children }) => {
//   const [notifications, setNotifications] = useState([]);

//   const addNotification = (notif) => {
//     setNotifications((prev) => [
//       {
//         id: Date.now(),
//         title: notif.title,
//         body: notif.body,
//         read: false,
//         createdAt: new Date(),
//       },
//       ...prev,
//     ]);
//   };

//   const unreadCount = notifications.filter((n) => !n.read).length;

//   return (
//     <NotificationContext.Provider
//       value={{ notifications, addNotification, unreadCount }}
//     >
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotifications = () => useContext(NotificationContext);
