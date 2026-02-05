import { X, Check, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function NotificationPanel({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notification/my", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setNotifications(data);
    } catch (err) {
      console.error("Notification fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    await fetch(`/api/notification/read/${ id }`, {
      method: "PATCH",
      credentials: "include",
    });

    setNotifications((prev) =>
      prev.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      )
    );
  };

  const markAllAsRead = async () => {
    await fetch("/api/notification/read-all", {
      method: "PATCH",
      credentials: "include",
    });

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
  };
  const handleDeleteNotification = async (notificationId) => {
    try {
      await fetch(`/api/notification/deleteNotification/${ notificationId }`, {
        method: "DELETE",
        credentials: "include",
      });

      setNotifications((prev) =>
        prev.filter((n) => n._id !== notificationId)
      );
    } catch (err) {
      console.error("Delete failed", err);
    }
  };
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-96 max-w-full h-full bg-white shadow-xl flex flex-col animate-slideIn">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">
            Notifications
          </h2>
          <div className="flex gap-2">
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:underline"
            >
              Mark all read
            </button>
            <button onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="p-4 text-sm text-slate-500">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">
              No notifications
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`p-4 border-b ${ !n.isRead ? "bg-blue-50" : ""
                  }`}
              >
                <h4 className="font-medium text-sm">
                  {n.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {n.message}
                </p>

                {!n.isRead && (
                  <button
                    onClick={() => markAsRead(n._id)}
                    className="mt-2 flex items-center gap-1 text-xs text-green-600 cursor-pointer"
                  >
                    <Check size={14} /> Mark as read
                  </button>
                )}
                <button onClick={() => handleDeleteNotification(n._id)} className="cursor-pointer"><Trash2 size={14} color="red"/></button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
