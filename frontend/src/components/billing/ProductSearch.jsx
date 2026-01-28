import { Search, Plus } from "lucide-react";
import { useState } from "react";

export default function ProductSearch({ products, onAdd }) {
  const [query, setQuery] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search product..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full outline-none text-sm"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {filtered.map((p) => (
          <button
            key={p.id}
            onClick={() => onAdd(p)}
            className="border rounded-lg p-3 text-left hover:bg-blue-50"
          >
            <p className="text-sm font-medium">{p.name}</p>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-slate-500">
                ₹{p.price}
              </span>
              <Plus size={16} className="text-blue-600" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
