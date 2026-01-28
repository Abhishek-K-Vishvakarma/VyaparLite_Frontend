import { Bell, User, Menu } from "lucide-react";

export default function Navbar({ onMenuClick }) {
  return (
    <header className="h-14 sm:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Hamburger menu for mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} className="text-slate-700" />
        </button>

        <h1 className="text-slate-700 font-semibold text-base sm:text-lg">Dashboard</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} className="text-slate-500 sm:w-5 sm:h-5" />
        </button>
        <button
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="User profile"
        >
          <User size={18} className="text-slate-500 sm:w-5 sm:h-5" />
        </button>
      </div>
    </header>
  );
}