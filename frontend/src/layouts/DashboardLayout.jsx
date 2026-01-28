// DashboardLayout.jsx
import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { Outlet, useLocation } from "react-router-dom";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setOpen(!open);
  };

  // Get page title based on route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/product':
        return 'Products';
      case '/invoices':
        return 'Invoices';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col lg:ml-64 w-full">
        <Navbar onMenuClick={toggleSidebar} pageTitle={getPageTitle()} />
        <main className="p-3 sm:p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}