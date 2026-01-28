import StatCard from "../components/dashboard/StatsCard";
import ReportsPage from "./ReportsPage";
// pages/DashboardPage.jsx

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* HEADER */}
      <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
        Dashboard
      </h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Today's Sales"
          value="₹4,500"
          type="sale"
        />
        <StatCard
          title="Invoices"
          value="12"
          type="invoice"
        />
        <StatCard
          title="Total Products"
          value="48"
          type="product"
        />
        <StatCard
          title="Low Stock Alerts"
          value="5"
          type="alert"
        />
      </div>

      {/* REPORTS */}
      <ReportsPage />

    </div>
  );
}
