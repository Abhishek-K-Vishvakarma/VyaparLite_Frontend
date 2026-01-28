import { Package } from "lucide-react";

export default function ProductChart({ total, lowStock }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
          <Package size={22} />
        </div>

        <div>
          <p className="text-sm text-slate-500">Total Products</p>
          <h2 className="text-xl font-semibold text-slate-900">
            {total}
          </h2>
        </div>
      </div>

      <p className="mt-4 text-sm text-red-500">
        ⚠ {lowStock} products low in stock
      </p>
    </div>
  );
}
