// components/dashboard/StatCard.jsx
import {
  TrendingUp,
  Package,
  AlertTriangle,
  FileText,
} from "lucide-react";

const ICONS = {
  sale: TrendingUp,
  product: Package,
  alert: AlertTriangle,
  invoice: FileText,
};

export default function StatCard({ title, value, type }) {
  const Icon = ICONS[type];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 flex items-center gap-4">

      <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <Icon size={22} />
      </div>

      <div>
        <p className="text-xs sm:text-sm text-slate-500">
          {title}
        </p>
        <h2 className="mt-1 text-lg sm:text-2xl font-semibold text-slate-900">
          {value}
        </h2>
      </div>

    </div>
  );
}
