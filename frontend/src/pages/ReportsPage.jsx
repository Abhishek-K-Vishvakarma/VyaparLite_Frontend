import SalesChart from "../components/reports/SalesChart";
import ProductChart from "../components/reports/ProductChart";
import StockAlertCard from "../components/reports/StockAlertCard";

const dailySales = [
  { label: "Mon", value: 1200 },
  { label: "Tue", value: 1800 },
  { label: "Wed", value: 900 },
  { label: "Thu", value: 2100 },
  { label: "Fri", value: 1600 },
];

const monthlySales = [
  { label: "Jan", value: 12000 },
  { label: "Feb", value: 15000 },
  { label: "Mar", value: 17000 },
  { label: "Apr", value: 14000 },
  { label: "May", value: 19000 },
];

const lowStockItems = [
  { name: "Sugar", qty: 3 },
  { name: "Oil", qty: 2 },
  { name: "Rice", qty: 4 },
];

export default function ReportsPage() {
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
          title="Monthly Sales Trend"
          data={monthlySales}
          type="line"
        />
      </div>

      {/* PRODUCT + STOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <ProductChart total={48} lowStock={5} />

        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Low Stock Alerts
          </h2>

          <div className="space-y-3">
            {lowStockItems.map((item, index) => (
              <StockAlertCard
                key={index}
                name={item.name}
                qty={item.qty}
              />
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
