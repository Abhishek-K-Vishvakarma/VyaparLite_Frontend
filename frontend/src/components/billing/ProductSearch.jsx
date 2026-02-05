import { useState } from "react";

const UNIT_LABEL = {
  KG: "kg",
  PIECE: "pcs",
  PACKET: "pkt",
  BOTTLE: "bottle",
};

export default function ProductSearch({ products, onAdd }) {
  const [query, setQuery] = useState("");
  const [qtyMap, setQtyMap] = useState({}); // qty per product

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const getQty = (product) => {
    if (qtyMap[product._id]) return qtyMap[product._id];
    return product.unit === "KG" ? 100 : 1; // default
  };

  const setQty = (productId, value) => {
    setQtyMap((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  return (
    <div className="bg-white p-4 rounded-xl border">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search product..."
        className="w-full border px-3 py-2 rounded mb-3"
      />

      {query &&
        filtered.map((p) => (
          <div
            key={p._id}
            className="flex justify-between items-center p-2 border-b"
          >
            {/* Product Info */}
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-slate-500">
                ₹{p.price} / {UNIT_LABEL[p.unit]}
              </p>
            </div>

            {/* Qty + Add */}
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min={1}
                value={getQty(p)}
                onChange={(e) =>
                  setQty(p._id, Number(e.target.value))
                }
                className="w-24 border px-2 py-1 rounded"
                placeholder={p.unit === "KG" ? "grams" : "qty"}
              />

              <span className="text-xs text-slate-500">
                {p.unit === "KG" ? "gm" : UNIT_LABEL[p.unit]}
              </span>

              <button
                onClick={() => {
                  onAdd(p, getQty(p));
                  setQuery("");
                }}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Add
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
