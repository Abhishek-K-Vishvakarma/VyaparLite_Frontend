import { AlertTriangle } from "lucide-react";

export default function StockAlertCard({ name, qty }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
      <div className="flex items-center gap-2 text-red-600">
        <AlertTriangle size={18} />
        <span className="text-sm font-medium">{name}</span>
      </div>

      <span className="text-sm font-semibold text-red-600">
        Qty: {qty}
      </span>
    </div>
  );
}
