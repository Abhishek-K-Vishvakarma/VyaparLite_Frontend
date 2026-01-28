import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
export default function AppLayout({ children }) {
  const [open, setOpen] = useState(false);

  // Toggle function for hamburger menu
  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col lg:ml-64 w-full">
        <Navbar onMenuClick={toggleSidebar} />
        <main className="p-3 sm:p-4 md:p-6">{children}</main>
        <Outlet/>
      </div>
    </div>
  );
}