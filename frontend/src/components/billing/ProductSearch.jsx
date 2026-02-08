import { useState } from "react";
import { toast } from "sonner";

const UNIT_LABEL = {
  KG: "kg",
  PIECE: "pcs",
  PACKET: "pkt",
  BOTTLE: "bottle",
};

export default function ProductSearch({ products, onAdd }) {
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [kg, setKg] = useState(0);
  const [grams, setGrams] = useState(0);
  const [qty, setQty] = useState(1);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (product) => {
    setSelectedProduct(product);
    setKg(0);
    setGrams(0);
    setQty(1);
  };

  const handleAdd = () => {
    if (!selectedProduct) return;

    // ✅ Stock validation
    if (selectedProduct.stock === 0) {
      toast.error(`${ selectedProduct.name } is out of stock!`, {
        description: "Please restock before selling",
      });
      return;
    }

    let finalQty;

    if (selectedProduct.unit === "KG") {
      finalQty = Number(kg) + Number(grams) / 1000;

      if (finalQty === 0) {
        toast.error("Please enter quantity", {
          description: "Enter kg or grams",
        });
        return;
      }

      // ✅ Check if requested quantity exceeds stock
      if (finalQty > selectedProduct.stock) {
        toast.error("Insufficient stock!", {
          description: `Available: ${ Math.floor(selectedProduct.stock) } kg ${ Math.round((selectedProduct.stock % 1) * 1000) } g`,
        });
        return;
      }
    } else {
      finalQty = Number(qty);

      if (finalQty < 1) {
        toast.error("Quantity must be at least 1");
        return;
      }

      // ✅ Check if requested quantity exceeds stock
      if (finalQty > selectedProduct.stock) {
        toast.error("Insufficient stock!", {
          description: `Available: ${ selectedProduct.stock } ${ UNIT_LABEL[selectedProduct.unit] }`,
        });
        return;
      }
    }

    // ✅ Add to bill
    onAdd(selectedProduct, finalQty);

    // ✅ Success toast
    toast.success(`${ selectedProduct.name } added to bill`, {
      description: selectedProduct.unit === "KG"
        ? `${ kg } kg ${ grams } g`
        : `${ qty } ${ UNIT_LABEL[selectedProduct.unit] }`,
    });

    // ✅ Reset
    setSelectedProduct(null);
    setQuery("");
    setKg(0);
    setGrams(0);
    setQty(1);
  };

  const formatStock = (stock, unit) => {
    if (unit === "KG") {
      const kg = Math.floor(stock);
      const grams = Math.round((stock % 1) * 1000);

      if (kg === 0 && grams > 0) {
        return `${ grams } g`;
      } else if (grams === 0) {
        return `${ kg } kg`;
      } else {
        return `${ kg } kg ${ grams } g`;
      }
    }
    return `${ stock } ${ UNIT_LABEL[unit] }`;
  };

  return (
    <div className="bg-white p-4 rounded-xl border space-y-3">
      <h2 className="font-semibold">Search Product</h2>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type product name..."
        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      {/* Search Results */}
      {query && (
        <div className="max-h-60 overflow-y-auto border rounded">
          {filtered.length === 0 ? (
            <p className="text-center text-slate-500 py-4 text-sm">
              No products found
            </p>
          ) : (
            filtered.map((p) => (
              <div
                key={p._id}
                onClick={() => handleSelect(p)}
                className={`px-3 py-2 hover:bg-slate-100 cursor-pointer border-b last:border-b-0 transition ${ p.stock === 0 ? "bg-red-50 opacity-60" : ""
                  }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm capitalize">{p.name}</p>
                    <p className="text-xs text-slate-500">
                      ₹{p.price}/{p.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-semibold ${ p.stock === 0
                        ? "text-red-600"
                        : p.stock <= 5
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}>
                      Stock: {formatStock(p.stock, p.unit)}
                    </p>
                    {p.stock === 0 && (
                      <span className="text-xs text-red-600 font-semibold">
                        OUT OF STOCK
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Selected Product - Add Form */}
      {selectedProduct && (
        <div className="border rounded-lg p-4 bg-slate-50 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium capitalize">
                Selected: {selectedProduct.name}
              </p>
              <p className="text-xs text-slate-600">
                ₹{selectedProduct.price}/{selectedProduct.unit} • Stock: {formatStock(selectedProduct.stock, selectedProduct.unit)}
              </p>
            </div>
            <button
              onClick={() => setSelectedProduct(null)}
              className="text-slate-500 hover:text-slate-700 text-sm"
            >
              ✕
            </button>
          </div>

          {selectedProduct.unit === "KG" ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">
                  KG
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={kg}
                  onChange={(e) => setKg(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">
                  Grams
                </label>
                <input
                  type="number"
                  min={0}
                  max={999}
                  step={50}
                  value={grams}
                  onChange={(e) => setGrams(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="0"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs text-slate-600 font-medium block mb-1">
                Quantity ({UNIT_LABEL[selectedProduct.unit]})
              </label>
              <input
                type="number"
                min={1}
                step={1}
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="1"
              />
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={selectedProduct.stock === 0}
            className={`w-full py-2 rounded-lg font-medium transition ${ selectedProduct.stock === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            {selectedProduct.stock === 0 ? "Out of Stock" : "Add to Bill"}
          </button>
        </div>
      )}
    </div>
  );
}