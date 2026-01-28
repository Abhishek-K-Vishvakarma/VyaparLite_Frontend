import { Home, FileText, Package, X, CreditCard, Receipt } from "lucide-react";
import Logo from "../ui/Logo";
import { Link } from "react-router-dom";
export default function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* Desktop Sidebar - Fixed */}
      <aside className="hidden lg:flex lg:flex-col w-64 h-screen bg-slate-900 text-slate-200 fixed left-0 top-0 z-50">
        <div className="p-6 border-b border-slate-700">
          <Logo />
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <Link to="/"><SidebarItem icon={<Home size={20} />} label="Dashboard" /></Link>
          <Link to="/product"><SidebarItem icon={<Package size={20} />} label="Products" /></Link>
          <Link><SidebarItem icon={<FileText size={20} />} label="Invoices" /></Link>
          <Link to="/billing"><SidebarItem icon={<CreditCard size={20} />} label="Billing" /></Link>
        </nav>
      </aside>

      {/* Mobile Sidebar - Slide from left */}
      <aside
        className={`lg:hidden fixed left-0 top-0 w-64 h-screen bg-slate-900 text-slate-200 z-50 transform transition-transform duration-300 ease-in-out ${ open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <Logo />
          <button
            onClick={() => setOpen(false)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-80px)]">
          <Link to="/">
            <SidebarItem
              icon={<Home size={20} />}
              label="Dashboard"
              onClick={() => setOpen(false)}
            />
          </Link>
          <Link to="/product">
            <SidebarItem
              icon={<Package size={20} />}
              label="Products"
              onClick={() => setOpen(false)}
            />
          </Link>
          <SidebarItem
            icon={<FileText size={20} />}
            label="Invoices"
            onClick={() => setOpen(false)}
          />
        </nav>
      </aside>
    </>
  );
}

function SidebarItem({ icon, label, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
        hover:bg-slate-800 text-slate-300 hover:text-white transition-colors duration-200"
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}