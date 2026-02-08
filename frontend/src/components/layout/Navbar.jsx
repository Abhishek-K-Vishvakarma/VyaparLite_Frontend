import { Bell, User, LogOut, Mail, Shield, RectangleEllipsis, Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NotificationPanel from "../notifications/NotificationList";
import useLogout from "../auth/hooks/useLogout";
import url from "../../network/UrlProvider";

export default function Navbar({ onMenuClick }) {
  const [notificationCount, setNotificationCount] = useState(0);
  const [loadings, setLoadings] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { logout, loading } = useLogout();

  // Load notifications and user data on mount
  useEffect(() => {
    fetchNotificationCount();
    loadUserData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadUserData = () => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  };

  const fetchNotificationCount = async () => {
    try {
      setLoadings(true);
      const res = await fetch(`${ url }/notification/countNotifications`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setNotificationCount(data.count || 0);
    } catch (err) {
      console.error("❌ Error fetching notifications:", err);
    } finally {
      setLoadings(false);
    }
  };

  return (
    <>
      <header className="h-14 sm:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-4 md:px-6 sticky top-0 z-30">
        {/* Left: Hamburger + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} className="text-slate-700" />
          </button>
          <h1 className="text-slate-700 font-semibold text-base sm:text-lg">Dashboard</h1>
        </div>

        {/* Right: Notifications + User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Bell */}
          <button
            className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Notifications"
            onClick={() => setShowNotifications(true)}
          >
            <Bell size={18} className="text-slate-500 sm:w-5 sm:h-5 cursor-pointer" />
            {!loadings && notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </button>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="User profile"
            >
              <User size={18} className="text-slate-500 sm:w-5 sm:h-5 cursor-pointer" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50 animate-fadeIn">
                {/* User Info */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-slate-50 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 truncate">{user?.name || "User"}</h3>
                      <p className="text-xs text-slate-500 truncate">{user?.email || "user@example.com"}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  {/* Email */}
                  <div className="flex items-center gap-3 px-3 py-2.5 text-slate-600">
                    <Mail size={16} className="text-slate-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="text-sm font-medium truncate">{user?.email || "N/A"}</p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="flex items-center gap-3 px-3 py-2.5 text-slate-600">
                    <Shield size={16} className="text-slate-400" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500">Role</p>
                      <p className="text-sm font-medium capitalize">{user?.role || "User"}</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 my-2"></div>

                  {/* Change Password */}
                  <button
                    onClick={() => navigate("/change-password")}
                    className="flex items-center justify-between w-full px-3 py-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <RectangleEllipsis size={16} />
                      Change Password
                    </span>
                  </button>

                  {/* Logout */}
                  <button
                    onClick={logout}
                    disabled={loading}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 cursor-pointer"
                  >
                    <LogOut size={16} />
                    <span>{loading ? "Logging out..." : "Logout"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        `}</style>
      </header>

      {/* Notifications Panel */}
      {showNotifications && (
        <NotificationPanel
          onClose={() => {
            setShowNotifications(false);
            fetchNotificationCount();
          }}
        />
      )}
    </>
  );
}
