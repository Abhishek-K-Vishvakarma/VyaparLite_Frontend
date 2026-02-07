import { useEffect, useState } from "react";
import axios from "axios";
import url from "../network/UrlProvider.jsx";
import StatCard from "../components/dashboard/StatsCard";
import ReportsPage from "./ReportsPage";

export default function DashboardPage() {
  const [todaySales, setTodaySales] = useState(0);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        /* -------- TODAY SALES + INVOICES -------- */
        const dailyRes = await axios.get(`${ url}/report/daily`,{
          withCredentials: true
        });

        setTodaySales(dailyRes.data.total);
        setInvoiceCount(dailyRes.data.count);

        /* -------- PRODUCTS -------- */
        const productRes = await axios.get(`${ url}/product/my-products`,{
          withCredentials: true
        });

        setTotalProducts(productRes.data.length);

        const lowStock = productRes.data.filter(
          (p) => p.stock <= 5
        );

        setLowStockCount(lowStock.length);
      } catch (err) {
        // throw new Error(err);
        console.error("Dashboard error:", err);
      }
    };
    fetchDashboardStats();
  }, []);

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
          value={`₹${ todaySales }`}
          type="sale"
        />

        <StatCard
          title="Invoices"
          value={invoiceCount}
          type="invoice"
        />

        <StatCard
          title="Total Products"
          value={totalProducts}
          type="product"
        />

        <StatCard
          title="Low Stock Alerts"
          value={lowStockCount}
          type="alert"
        />
      </div>

      {/* REPORTS */}
      <ReportsPage />
    </div>
  );
}
