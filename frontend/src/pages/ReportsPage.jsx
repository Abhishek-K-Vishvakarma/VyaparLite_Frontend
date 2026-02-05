import { useEffect, useState } from "react";
import axios from "axios";

import SalesChart from "../components/reports/SalesChart";
import ProductChart from "../components/reports/ProductChart";
import StockAlertCard from "../components/reports/StockAlertCard";

export default function ReportsPage() {
  const [dailySales, setDailySales] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [lowStockItems, setLowStockItems] = useState([]);

  /* ---------------- FETCH REPORTS ---------------- */
  useEffect(() => {
    /* -------- DAILY SALES CHART -------- */
    const fetchDailyChart = async () => {
      const res = await axios.get("/api/report/chart");

      const formatted = res.data.map((item) => ({
        label: `${ item._id.day }/${ item._id.month }`,
        value: item.total,
      }));

      setDailySales(formatted);
    };

    /* -------- MONTHLY SALES -------- */
    const fetchMonthlyReport = async () => {
      const res = await axios.get("/api/report/monthly");

      // monthly total trend (single month example)
      setMonthlySales([
        {
          label: res.data.month,
          value: res.data.total,
        },
      ]);
    };

    /* -------- PRODUCTS + LOW STOCK -------- */
    const fetchProducts = async () => {
      const res = await axios.get("/api/product");

      setTotalProducts(res.data.length);

      const lowStock = res.data.filter((p) => p.stock <= 5);

      setLowStockCount(lowStock.length);
      setLowStockItems(lowStock);
    };
    fetchDailyChart();
    fetchMonthlyReport();
    fetchProducts();
  }, []);


  return (
    <div className="space-y-6">

      {/* SALES CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart
          title="Today's Sales"
          data={dailySales}
          type="bar"
        />

        <SalesChart
          title="Monthly Sales"
          data={monthlySales}
          type="line"
        />
      </div>

      {/* PRODUCTS & STOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <ProductChart
          total={totalProducts}
          lowStock={lowStockCount}
        />

        {/* LOW STOCK LIST */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            ⚠ Low Stock Alerts
          </h2>

          {lowStockItems.length === 0 ? (
            <p className="text-sm text-slate-500">
              All products are sufficiently stocked 🎉
            </p>
          ) : (
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <StockAlertCard
                  key={item._id}
                  name={item.name}
                  qty={item.stock}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
